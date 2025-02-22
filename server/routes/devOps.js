const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllTopics,
  getWeekTopics,
  updateTopicStatus,
  addNotes,
  getProgress
} = require('../controllers/devOpsController');

// All routes are protected
// router.use(auth);

// Get all topics
router.get('/', getAllTopics);

// Get progress statistics
router.get('/progress', getProgress);

// Get specific week's topics
router.get('/week/:week', getWeekTopics);

// Update topic status
router.put('/status', updateTopicStatus);

// Add notes to a topic
router.put('/notes', addNotes);

module.exports = router;
