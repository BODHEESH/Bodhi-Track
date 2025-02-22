const Reminder = require('../models/Reminder');

exports.createReminder = async (req, res) => {
  try {
    const { type, time, message, daysOfWeek } = req.body;
    const userId = req.user._id;

    const reminder = new Reminder({
      userId,
      type,
      time,
      message,
      daysOfWeek
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reminder'
    });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    const reminder = await Reminder.findOne({ _id: reminderId, userId });
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    Object.assign(reminder, updates);
    await reminder.save();

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder'
    });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user._id;

    const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder'
    });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const userId = req.user._id;
    const reminders = await Reminder.find({ userId }).sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders'
    });
  }
};

// Helper function to check and trigger reminders
exports.checkReminders = async () => {
  try {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Find all enabled reminders that should trigger now
    const reminders = await Reminder.find({
      enabled: true,
      daysOfWeek: currentDay,
      $or: [
        { lastTriggered: { $exists: false } },
        { lastTriggered: { $lt: new Date(now.setHours(0, 0, 0, 0)) } }
      ]
    });

    // Process each reminder
    for (const reminder of reminders) {
      const reminderTime = new Date(reminder.time);
      const currentTime = new Date();

      if (
        currentTime.getHours() === reminderTime.getHours() &&
        currentTime.getMinutes() === reminderTime.getMinutes()
      ) {
        // Update last triggered time
        reminder.lastTriggered = new Date();
        await reminder.save();

        // Here you would implement the actual notification
        // This could be through web push notifications, email, etc.
        console.log(`Triggering reminder: ${reminder.message}`);
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

module.exports = exports;
