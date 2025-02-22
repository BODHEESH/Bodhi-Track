const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: {
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
  },
  // Optional fields based on section
  subtopics: [{
    type: String
  }],
  components: [{
    type: String
  }],
  principles: [{
    type: String
  }],
  patterns: [{
    type: String
  }],
  concepts: [{
    type: String
  }],
  types: [{
    type: String
  }],
  aspects: [{
    type: String
  }]
});

const systemDesignTopicSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['HLD', 'LLD', 'Case Studies']
  },
  title: {
    type: String,
    required: true
  },
  topics: [topicSchema]
}, {
  timestamps: true
});

const SystemDesignTopic = mongoose.model('SystemDesignTopic', systemDesignTopicSchema);

module.exports = SystemDesignTopic;
