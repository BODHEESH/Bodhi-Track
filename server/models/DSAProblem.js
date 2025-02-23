const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  }
});

const dsaProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  problems: [problemSchema]
}, {
  timestamps: true
});

const DSAProblem = mongoose.model('DSAProblem', dsaProblemSchema);

module.exports = DSAProblem;
