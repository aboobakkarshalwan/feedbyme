const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    // Basic stats
    const [totalFeedback, totalUsers, openFeedback, resolvedFeedback] = await Promise.all([
      Feedback.countDocuments(),
      User.countDocuments(),
      Feedback.countDocuments({ status: 'Open' }),
      Feedback.countDocuments({ status: 'Resolved' })
    ]);

    // Feedback by status
    const byStatus = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Feedback by category
    const byCategory = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Feedback by priority
    const byPriority = await Feedback.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Feedback over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const feedbackOverTime = await Feedback.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average rating
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Recent feedback
    const recentFeedback = await Feedback.find()
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Top upvoted
    const topUpvoted = await Feedback.aggregate([
      { $addFields: { upvoteCount: { $size: '$upvotes' } } },
      { $sort: { upvoteCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      stats: {
        totalFeedback,
        totalUsers,
        openFeedback,
        resolvedFeedback,
        avgRating: avgRating[0]?.avgRating?.toFixed(1) || '0.0'
      },
      charts: {
        byStatus,
        byCategory,
        byPriority,
        feedbackOverTime
      },
      recentFeedback,
      topUpvoted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(filter)
    ]);

    // Get feedback count per user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const feedbackCount = await Feedback.countDocuments({ author: user._id });
        return { ...user, feedbackCount };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or user.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update feedback (status, priority, assign)
// @route   PUT /api/admin/feedback/:id
exports.updateFeedbackAdmin = async (req, res, next) => {
  try {
    const { status, priority, assignedTo } = req.body;
    const updates = {};

    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo || null;

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('author', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    // Create notifications
    if (status) {
      await Notification.create({
        userId: feedback.author._id,
        message: `Your feedback "${feedback.title}" status was changed to "${status}"`,
        type: 'status_update',
        feedbackId: feedback._id
      });
    }

    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        message: `You were assigned to feedback "${feedback.title}"`,
        type: 'assignment',
        feedbackId: feedback._id
      });
    }

    res.json({ feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Export feedback as CSV
// @route   GET /api/admin/export
exports.exportFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('author', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    const csvHeader = 'ID,Title,Category,Status,Priority,Rating,Author,Assigned To,Upvotes,Comments,Anonymous,Created At\n';
    const csvRows = feedbacks.map(f => {
      return [
        f._id,
        `"${(f.title || '').replace(/"/g, '""')}"`,
        f.category,
        f.status,
        f.priority,
        f.rating,
        f.isAnonymous ? 'Anonymous' : (f.author?.name || 'Unknown'),
        f.assignedTo?.name || 'Unassigned',
        f.upvotes?.length || 0,
        f.comments?.length || 0,
        f.isAnonymous ? 'Yes' : 'No',
        new Date(f.createdAt).toISOString()
      ].join(',');
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk actions on feedback
// @route   POST /api/admin/bulk
exports.bulkAction = async (req, res, next) => {
  try {
    const { action, feedbackIds, value } = req.body;

    if (!feedbackIds || !Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      return res.status(400).json({ error: 'feedbackIds array is required.' });
    }

    let result;
    switch (action) {
      case 'close':
        result = await Feedback.updateMany(
          { _id: { $in: feedbackIds } },
          { status: 'Closed' }
        );
        break;
      case 'assign':
        if (!value) return res.status(400).json({ error: 'User ID required for assignment.' });
        result = await Feedback.updateMany(
          { _id: { $in: feedbackIds } },
          { assignedTo: value }
        );
        break;
      case 'delete':
        result = await Feedback.deleteMany({ _id: { $in: feedbackIds } });
        break;
      case 'status':
        if (!value) return res.status(400).json({ error: 'Status value required.' });
        result = await Feedback.updateMany(
          { _id: { $in: feedbackIds } },
          { status: value }
        );
        break;
      default:
        return res.status(400).json({ error: 'Invalid action. Use: close, assign, delete, status.' });
    }

    res.json({ message: `Bulk ${action} completed.`, result });
  } catch (error) {
    next(error);
  }
};
