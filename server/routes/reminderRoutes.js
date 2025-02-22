const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, reminderController.createReminder);
router.put('/:reminderId', protect, reminderController.updateReminder);
router.delete('/:reminderId', protect, reminderController.deleteReminder);
router.get('/', protect, reminderController.getReminders);

module.exports = router;
