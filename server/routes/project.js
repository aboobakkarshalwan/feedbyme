const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getProjects)
  .post(authMiddleware, createProject);

router.route('/:id')
  .get(getProject) // Publicly accessible to anyone with the link
  .put(authMiddleware, updateProject)
  .delete(authMiddleware, deleteProject);

module.exports = router;
