const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const { protect } = require('../middleware/authMiddleware');

// Daily Plan Routes
router.post('/daily', protect, planningController.createDailyPlan);
router.put('/daily/:planId', protect, planningController.updateDailyPlan);
router.get('/daily', protect, planningController.getDailyPlan);

// Weekly Plan Routes
router.post('/weekly', protect, planningController.createWeeklyPlan);
router.put('/weekly/:planId', protect, planningController.updateWeeklyPlan);
router.get('/weekly', protect, planningController.getWeeklyPlan);

module.exports = router;
