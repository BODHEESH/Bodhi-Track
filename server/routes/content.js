const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllContent,
  getContentByPlatform,
  createContent,
  updateContent,
  updateStatus,
  updateAnalytics,
  updateTask,
  getStatistics
} = require('../controllers/contentController');

// All routes are protected
// router.use(auth);

// Get all content
router.get('/', getAllContent);

// Get content statistics
router.get('/statistics', getStatistics);

// Get content by platform
router.get('/platform/:platform', getContentByPlatform);

// Create new content
router.post('/', createContent);

// Update content
router.put('/:id', updateContent);

// Update content status
router.put('/:id/status', updateStatus);

// Update content analytics
router.put('/:id/analytics', updateAnalytics);

// Update task status
router.put('/:id/tasks/:taskId', updateTask);

module.exports = router;
