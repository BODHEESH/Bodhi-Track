const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const {
  getAllTopics,
  getTopicsBySection,
  updateTopicStatus,
  getStatistics
} = require('../controllers/systemDesignController');

// Protected routes
// router.use(protect);

router.get('/', getAllTopics);
router.get('/section/:section', getTopicsBySection);
router.put('/status', updateTopicStatus);
router.get('/stats', getStatistics);

module.exports = router;
