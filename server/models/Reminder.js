const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['DSA', 'SYSTEM_DESIGN', 'PROJECT', 'CONTENT', 'BREAK'],
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  daysOfWeek: {
    type: [Number], // 0 = Sunday, 1 = Monday, etc.
    default: [1, 2, 3, 4, 5] // Monday to Friday by default
  },
  lastTriggered: {
    type: Date
  }
}, {
  timestamps: true
});

// Create index for efficient querying
reminderSchema.index({ userId: 1, enabled: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
