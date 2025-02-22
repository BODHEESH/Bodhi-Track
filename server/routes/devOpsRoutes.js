const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const devOpsController = require('../controllers/devOpsController');

// All routes are protected
router.use(protect);

// Get all topics
router.get('/', devOpsController.getAllTopics);

// Get topics by week
router.get('/week/:week', devOpsController.getTopicsByWeek);

// Update topic status
router.put('/status', devOpsController.updateTopicStatus);

// Get statistics
router.get('/stats', devOpsController.getStatistics);

module.exports = router;
