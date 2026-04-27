const Project = require('../models/Project');
const Feedback = require('../models/Feedback');

// @desc    Get all projects (admin) or accessible projects
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    // Find projects where user is the owner OR user has submitted feedback
    const userFeedback = await Feedback.find({ author: req.user._id }).distinct('project');
    
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { _id: { $in: userFeedback } }
      ]
    }).sort('-createdAt').lean();
    
    // Add feedback count to each project
    const projectsWithCounts = await Promise.all(projects.map(async (project) => {
      const feedbackCount = await Feedback.countDocuments({ project: project._id });
      return { ...project, feedbackCount };
    }));
    
    res.json({ projects: projectsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID (publicly accessible if isPublic is true)
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name avatar');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // For now, anyone with the link can view it
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Admin only
exports.createProject = async (req, res, next) => {
  try {
    req.body.owner = req.user._id;
    const project = await Project.create(req.body);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin only
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }
    
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin only
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }
    
    await Project.deleteOne({ _id: req.params.id });
    // Also delete all feedback associated with this project
    await Feedback.deleteMany({ project: req.params.id });
    
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
