const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  updateTaskStatus,
  addWorkSession,
  getStatistics
} = require('../controllers/projectController');

// All routes are protected
// router.use(protect);

router.route('/')
  .get(getAllProjects)
  .post(createProject);

router.route('/statistics')
  .get(getStatistics);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/tasks')
  .post(addTask);

router.route('/:projectId/tasks/:taskId/status')
  .put(updateTaskStatus);

router.route('/:id/work-sessions')
  .post(addWorkSession);

module.exports = router;