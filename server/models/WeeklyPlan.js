const mongoose = require('mongoose');

const weeklyGoalSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['DSA', 'SYSTEM_DESIGN', 'PROJECT', 'CONTENT', 'OTHER'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  completed: {
    type: Number,
    default: 0
  },
  notes: String
});

const weeklyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  goals: [weeklyGoalSchema],
  dailyPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyPlan'
  }],
  reflection: {
    achievements: [String],
    challenges: [String],
    improvements: [String]
  },
  metrics: {
    dsaProblems: {
      target: { type: Number, default: 0 },
      completed: { type: Number, default: 0 }
    },
    systemDesign: {
      topics: { type: Number, default: 0 },
      completed: { type: Number, default: 0 }
    },
    projectProgress: {
      plannedHours: { type: Number, default: 0 },
      actualHours: { type: Number, default: 0 }
    },
    contentCreation: {
      blogs: { type: Number, default: 0 },
      videos: { type: Number, default: 0 }
    }
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'REVIEWED'],
    default: 'IN_PROGRESS'
  }
}, {
  timestamps: true
});

// Create index for efficient querying
weeklyPlanSchema.index({ userId: 1, weekStartDate: 1 });

const WeeklyPlan = mongoose.model('WeeklyPlan', weeklyPlanSchema);
module.exports = WeeklyPlan;
