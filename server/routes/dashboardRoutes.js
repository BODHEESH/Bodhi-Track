const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardData,
  updateStats,
  addAchievement,
  addActivity,
  updateLearningProgress,
  addTask,
  updateTaskStatus,
  updateLearningHours,
  updateTargets,
  getStats,
  getAchievements,
  getRecentActivity,
  getUpcomingTasks,
  getLearningProgress,
  updateSubtaskStatus
} = require('../controllers/dashboardController');

// All routes are protected
router.use(protect);

// Get all dashboard data
router.get('/', getDashboardData);

// Get dashboard stats
router.get('/stats', getStats);

// Update user stats
router.put('/stats', updateStats);

// Update targets
router.put('/targets', updateTargets);

// Achievements routes
router.post('/achievements', addAchievement);
router.get('/achievements', getAchievements);

// Activity routes
router.post('/activities', addActivity);
router.get('/recent-activity', getRecentActivity);

// Learning progress routes
router.put('/progress', updateLearningProgress);
router.get('/learning-progress', getLearningProgress);

// Update learning hours
router.put('/learning-hours', updateLearningHours);

// Task routes
router.post('/tasks', addTask);
router.put('/tasks/status', updateTaskStatus);
router.patch('/tasks/:taskId/subtasks/:subtaskId', updateSubtaskStatus);
router.get('/upcoming-tasks', getUpcomingTasks);

module.exports = router;
