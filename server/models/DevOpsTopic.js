const mongoose = require('mongoose');

const devOpsTopicSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  topics: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtopics: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    completedAt: {
      type: Date
    },
    notes: {
      type: String
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DevOpsTopic', devOpsTopicSchema);
