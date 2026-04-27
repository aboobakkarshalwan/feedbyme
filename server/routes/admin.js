const router = require('express').Router();
const {
  getDashboard,
  getUsers,
  updateUserRole,
  updateFeedbackAdmin,
  exportFeedback,
  bulkAction
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.put('/feedback/:id', updateFeedbackAdmin);
router.get('/export', exportFeedback);
router.post('/bulk', bulkAction);

module.exports = router;
