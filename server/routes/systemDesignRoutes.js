const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    getAllTopics, 
    getTopicsBySection, 
    updateTopicStatus, 
    getStatistics 
} = require('../controllers/systemDesignController');

// Get all topics
router.get('/', protect, getAllTopics);

// Get topics by section
router.get('/:section', protect, getTopicsBySection);

// Update topic status
router.put('/status', protect, updateTopicStatus);

// Get statistics
router.get('/stats/overview', protect, getStatistics);

module.exports = router;
