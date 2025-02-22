const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['DSA', 'SYSTEM_DESIGN', 'PROJECT', 'CONTENT', 'OTHER'],
    required: true
  },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
    default: 'NOT_STARTED'
  },
  scheduledTime: {
    start: Date,
    end: Date
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM'
  },
  notes: String,
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  }
});

const dailyPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [taskSchema],
  completed: {
    type: Boolean,
    default: false
  },
  summary: {
    type: String
  },
  metrics: {
    dsaProblems: {
      planned: { type: Number, default: 0 },
      completed: { type: Number, default: 0 }
    },
    systemDesign: {
      planned: { type: Number, default: 0 },
      completed: { type: Number, default: 0 }
    },
    projectWork: {
      planned: { type: Number, default: 0 }, // in minutes
      completed: { type: Number, default: 0 }
    },
    contentCreation: {
      planned: { type: Number, default: 0 }, // in minutes
      completed: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Create index for efficient querying
dailyPlanSchema.index({ userId: 1, date: 1 });

const DailyPlan = mongoose.model('DailyPlan', dailyPlanSchema);
module.exports = DailyPlan;
