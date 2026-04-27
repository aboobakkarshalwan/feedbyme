const router = require('express').Router();
const {
  getAllFeedback,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  toggleUpvote,
  addComment,
  deleteComment
} = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
const { validateFeedback, validateComment, validateObjectId } = require('../middleware/validate');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'feedback-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
});

// Routes
router.get('/', optionalAuth, getAllFeedback);
router.post('/', optionalAuth, upload.single('image'), validateFeedback, createFeedback);
router.get('/:id', optionalAuth, getFeedback);
router.put('/:id', authMiddleware, updateFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);
router.post('/:id/upvote', authMiddleware, toggleUpvote);
router.post('/:id/comment', authMiddleware, validateComment, addComment);
router.delete('/:id/comment/:commentId', authMiddleware, deleteComment);

module.exports = router;
