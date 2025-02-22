const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Medium', 'Dev.to', 'Hashnode', 'Personal Blog', 'YouTube', 'LinkedIn']
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'in-progress', 'reviewing', 'published'],
    default: 'draft'
  },
  tasks: [{
    task: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    reactions: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    }
  },
  publishDate: {
    type: Date
  },
  lastUpdated: {
    type: Date
  },
  url: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster querying
contentSchema.index({ user: 1, platform: 1, status: 1 });

// Virtual for calculating completion percentage
contentSchema.virtual('completionPercentage').get(function() {
  if (!this.tasks.length) return 0;
  const completedTasks = this.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Method to update content status
contentSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'published') {
    this.publishDate = new Date();
  }
  
  return this.save();
};

// Method to update analytics
contentSchema.methods.updateAnalytics = function(analyticsData) {
  Object.assign(this.analytics, analyticsData);
  return this.save();
};

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
