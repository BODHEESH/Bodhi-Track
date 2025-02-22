const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  stats: {
    dsaProblems: {
      value: { type: String, default: '0' },
      change: { type: String, default: '+0 this week' }
    },
    systemDesign: {
      value: { type: String, default: '0' },
      change: { type: String, default: '+0 this week' }
    },
    devopsTasks: {
      value: { type: String, default: '0' },
      change: { type: String, default: '+0 this week' }
    },
    learningHours: {
      value: { type: String, default: '0' },
      change: { type: String, default: '+0 this week' }
    }
  },
  targets: {
    dsa: {
      total: { type: Number, default: 150 },
      weekly: { type: Number, default: 8 },
      pending: { type: Number, default: 0 }
    },
    systemDesign: {
      total: { type: Number, default: 30 },
      weekly: { type: Number, default: 2 },
      pending: { type: Number, default: 0 }
    },
    devops: {
      total: { type: Number, default: 45 },
      weekly: { type: Number, default: 5 },
      pending: { type: Number, default: 0 }
    },
    learningHours: {
      total: { type: Number, default: 120 },
      weekly: { type: Number, default: 8 },
      pending: { type: Number, default: 0 }
    }
  },
  learningHours: {
    total: {
      type: Number,
      default: 0
    },
    thisWeek: {
      type: Number,
      default: 0
    },
    history: [{
      date: {
        type: Date,
        required: true
      },
      hours: {
        type: Number,
        required: true
      }
    }]
  },
  achievements: [{
    title: String,
    description: String,
    date: Date,
    points: Number
  }],
  recentActivity: [{
    type: String,
    title: String,
    description: String,
    timestamp: Date,
    difficulty: String
  }],
  learningProgress: {
    dsa: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 300 },
      categories: [{
        name: String,
        progress: Number
      }]
    },
    devops: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 90 },
      categories: [{
        name: String,
        progress: Number
      }]
    }
  },
  upcomingTasks: [{
    title: String,
    deadline: Date,
    type: String,
    priority: String,
    subtasks: [{
      name: String,
      completed: { type: Boolean, default: false }
    }]
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
