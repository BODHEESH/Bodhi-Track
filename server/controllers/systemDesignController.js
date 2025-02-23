const SystemDesign = require('../models/SystemDesign');

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    console.log('Fetching all system design topics.............');
    const topics = await SystemDesign.find().lean();
    console.log('Found topics:', JSON.stringify(topics, null, 2));
    
    if (!topics || topics.length === 0) {
      console.log('No topics found in collection systemdesigntopics');
      // List all collections to verify
      const collections = await SystemDesign.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    }
    
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics',
      error: error.message
    });
  }
};

// Get topics by section
exports.getTopicsBySection = async (req, res) => {
  try {
    const { section } = req.params;
    console.log('Fetching topics for section:', section);
    const topics = await SystemDesign.find({ section }).lean();
    console.log('Found topics for section:', topics);
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics by section:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics',
      error: error.message
    });
  }
};

// Update topic status
exports.updateTopicStatus = async (req, res) => {
  try {
    const { topicId, status } = req.body;
    console.log('Updating topic status:', { topicId, status });

    const section = await SystemDesign.findOne({ 'topics.id': topicId });
    if (!section) {
      console.log('Topic not found:', topicId);
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const topic = section.topics.find(t => t.id === topicId);
    if (!topic) {
      console.log('Topic not found in section:', topicId);
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    topic.status = status;
    await section.save();
    console.log('Topic updated successfully:', topic);

    res.status(200).json({
      success: true,
      topic
    });
  } catch (error) {
    console.error('Error updating topic status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating topic status',
      error: error.message
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const sections = await SystemDesign.find().lean();
    
    const stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      byDifficulty: {
        easy: { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        hard: { total: 0, completed: 0 }
      }
    };

    sections.forEach(section => {
      section.topics.forEach(topic => {
        stats.total++;
        stats.byDifficulty[topic.difficulty].total++;

        switch (topic.status) {
          case 'completed':
            stats.completed++;
            stats.byDifficulty[topic.difficulty].completed++;
            break;
          case 'in-progress':
            stats.inProgress++;
            break;
          default:
            stats.todo++;
        }
      });
    });

    console.log('System Design statistics:', stats);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting statistics',
      error: error.message
    });
  }
};
