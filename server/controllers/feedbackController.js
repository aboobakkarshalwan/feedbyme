const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

// @desc    Get all feedback with filters, search, sort, pagination
// @route   GET /api/feedback
exports.getAllFeedback = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      category,
      priority,
      search,
      sort = '-createdAt',
      author,
      tags,
      projectId
    } = req.query;

    const filter = {};

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (author) filter.author = author;
    if (tags) filter.tags = { $in: tags.split(',') };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = {};
    if (sort === 'upvotes') {
      // We'll sort after aggregation or use a workaround
      sortObj = { createdAt: -1 };
    } else if (sort === '-upvotes') {
      sortObj = { createdAt: -1 };
    } else {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortObj[sortField] = sortOrder;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .populate('author', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .populate('comments.user', 'name email avatar')
        .populate('upvotes', 'name')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Feedback.countDocuments(filter)
    ]);

    // Sort by upvote count if requested
    if (sort === 'upvotes' || sort === '-upvotes') {
      feedbacks.sort((a, b) => {
        const diff = (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        return sort === '-upvotes' ? diff : -diff;
      });
    }

    res.json({
      feedbacks,
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

// @desc    Get single feedback
// @route   GET /api/feedback/:id
exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('project')
      .populate('author', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .populate('upvotes', 'name email avatar');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    res.json({ feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res, next) => {
  try {
    const { projectId, title, description, category, priority, rating, tags, isAnonymous, guestEmail } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required to submit feedback' });
    }

    const feedbackData = {
      project: projectId,
      title,
      description,
      category,
      priority: priority || 'Medium',
      rating: rating || 3,
      tags: tags || [],
      isAnonymous: isAnonymous || false
    };

    if (req.user) {
      feedbackData.author = req.user._id;
    } else {
      if (!guestEmail) {
        return res.status(400).json({ error: 'Email is required for guest submissions' });
      }
      feedbackData.guestEmail = guestEmail;
    }

    if (req.file) {
      // Create a relative URL for the image
      feedbackData.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.customAnswers) {
      try {
        feedbackData.customAnswers = typeof req.body.customAnswers === 'string' 
          ? JSON.parse(req.body.customAnswers) 
          : req.body.customAnswers;
      } catch (e) {
        console.error('Error parsing customAnswers:', e);
      }
    }

    const feedback = await Feedback.create(feedbackData);

    const populated = await Feedback.findById(feedback._id)
      .populate('author', 'name email avatar');

    res.status(201).json({ feedback: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
exports.updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    // Only author or admin can update
    if (feedback.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this feedback.' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'priority', 'rating', 'tags', 'isAnonymous'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await Feedback.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('author', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    res.json({ feedback: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    // Only author, admin, or project owner can delete
    const project = await mongoose.model('Project').findById(feedback.project);
    const isOwner = project && project.owner.toString() === req.user._id.toString();
    const isAuthor = feedback.author && feedback.author.toString() === req.user._id.toString();

    if (!isAuthor && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this feedback.' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote on feedback
// @route   POST /api/feedback/:id/upvote
exports.toggleUpvote = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    const userId = req.user._id;
    const upvoteIndex = feedback.upvotes.findIndex(id => id.toString() === userId.toString());

    if (upvoteIndex > -1) {
      // Remove upvote
      feedback.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      feedback.upvotes.push(userId);

      // Create notification for feedback author (if not self-upvoting)
      if (feedback.author.toString() !== userId.toString()) {
        await Notification.create({
          userId: feedback.author,
          message: `${req.user.name} upvoted your feedback "${feedback.title}"`,
          type: 'upvote',
          feedbackId: feedback._id
        });
      }
    }

    await feedback.save();

    const updated = await Feedback.findById(req.params.id)
      .populate('upvotes', 'name email avatar');

    res.json({
      upvotes: updated.upvotes,
      upvoteCount: updated.upvotes.length,
      hasUpvoted: upvoteIndex === -1 // true if just added
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to feedback
// @route   POST /api/feedback/:id/comment
exports.addComment = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text
    };

    feedback.comments.push(comment);
    await feedback.save();

    // Create notification for feedback author (if not self-commenting)
    if (feedback.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: feedback.author,
        message: `${req.user.name} commented on your feedback "${feedback.title}"`,
        type: 'comment',
        feedbackId: feedback._id
      });
    }

    const updated = await Feedback.findById(req.params.id)
      .populate('comments.user', 'name email avatar');

    res.status(201).json({ comments: updated.comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from feedback
// @route   DELETE /api/feedback/:id/comment/:commentId
exports.deleteComment = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    const comment = feedback.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Only comment author or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment.' });
    }

    feedback.comments.pull(req.params.commentId);
    await feedback.save();

    res.json({ message: 'Comment deleted successfully.', comments: feedback.comments });
  } catch (error) {
    next(error);
  }
};
