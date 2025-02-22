const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dsaController = require('../controllers/dsaController');

// Apply auth middleware to all routes
router.use(protect);

// Get all problems
router.get('/', dsaController.getAllProblems);

// Get problems by day
router.get('/day/:day', dsaController.getProblemsByDay);

// Update problem status
router.patch('/status', dsaController.updateProblemStatus);

// Get statistics
router.get('/stats', dsaController.getStatistics);

module.exports = router;
