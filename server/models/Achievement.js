const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['DSA', 'System Design', 'DevOps', 'Learning', 'General'],
    required: true
  },
  icon: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
