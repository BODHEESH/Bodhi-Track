const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Web App', 'Mobile App', 'NPM Package', 'CLI Tool', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Planned', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planned'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  startDate: {
    type: Date
  },
  targetDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  githubUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  features: [{
    title: String,
    description: String,
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed', 'Blocked'],
      default: 'Planned'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  }],
  tasks: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed', 'Blocked'],
      default: 'Todo'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    dueDate: Date,
    completedDate: Date,
    dependencies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }]
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  workSessions: [{
    date: { type: Date, default: Date.now },
    duration: Number, // in minutes
    tasks: [String],
    notes: String
  }],
  challenges: [{
    title: String,
    description: String,
    solution: String,
    date: { type: Date, default: Date.now }
  }],
  learnings: [{
    topic: String,
    description: String,
    date: { type: Date, default: Date.now }
  }],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  team: [{
    name: String,
    role: String,
    github: String
  }]
}, {
  timestamps: true
});

// Index for faster querying
projectSchema.index({ user: 1, status: 1, type: 1 });

// Virtual for calculating completion percentage
projectSchema.virtual('completionPercentage').get(function() {
  if (!this.tasks.length) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'Completed').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Method to add a work session
projectSchema.methods.addWorkSession = function(sessionData) {
  this.workSessions.push(sessionData);
  this.timeSpent += sessionData.duration;
  return this.save();
};

// Method to update project progress
projectSchema.methods.updateProgress = function() {
  this.progress = this.completionPercentage;
  
  if (this.progress === 100 && this.status !== 'Completed') {
    this.status = 'Completed';
    this.completionDate = new Date();
  }
  
  return this.save();
};

// Method to add a task
projectSchema.methods.addTask = function(taskData) {
  this.tasks.push(taskData);
  return this.updateProgress();
};

// Method to update task status
projectSchema.methods.updateTaskStatus = function(taskId, newStatus) {
  const task = this.tasks.id(taskId);
  if (!task) throw new Error('Task not found');
  
  task.status = newStatus;
  if (newStatus === 'Completed') {
    task.completedDate = new Date();
  }
  
  return this.updateProgress();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
