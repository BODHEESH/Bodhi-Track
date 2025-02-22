const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['DSA', 'System Design', 'Frontend', 'Backend', 'DevOps', 'Interview Prep', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['Article', 'Video', 'Course', 'Book', 'GitHub', 'Documentation', 'Tool', 'Other']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  status: {
    type: String,
    enum: ['To Read', 'In Progress', 'Completed'],
    default: 'To Read'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  author: {
    name: String,
    url: String
  },
  metadata: {
    duration: String, // for videos/courses
    pages: Number, // for books/articles
    language: String,
    publishDate: Date,
    lastUpdated: Date
  },
  progress: {
    current: Number, // current page/video timestamp
    total: Number, // total pages/duration
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastAccessed: Date
  },
  reviews: [{
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for faster querying
resourceSchema.index({ user: 1, category: 1, type: 1, isFavorite: 1 });

// Virtual for calculating average rating
resourceSchema.virtual('averageRating').get(function() {
  if (!this.reviews.length) return 0;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / this.reviews.length) * 10) / 10;
});

// Method to update progress
resourceSchema.methods.updateProgress = function(currentProgress) {
  this.progress.current = currentProgress;
  this.progress.lastAccessed = new Date();
  
  if (this.progress.total) {
    this.progress.percentage = Math.round((currentProgress / this.progress.total) * 100);
    
    if (this.progress.percentage >= 100) {
      this.status = 'Completed';
    } else if (this.progress.percentage > 0) {
      this.status = 'In Progress';
    }
  }
  
  return this.save();
};

// Method to add review
resourceSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.save();
};

// Method to toggle favorite
resourceSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
