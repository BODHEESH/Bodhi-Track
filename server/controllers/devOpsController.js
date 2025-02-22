const DevOps = require('../models/DevOps');

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    console.log('Fetching all DevOps topics...');
    const topics = await DevOps.find().lean();
    console.log('Found topics:', JSON.stringify(topics, null, 2));
    
    if (!topics || topics.length === 0) {
      console.log('No topics found in collection devopstopics');
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

// Get topics by week
exports.getTopicsByWeek = async (req, res) => {
  try {
    const { week } = req.params;
    console.log('Fetching topics for week:', week);
    const topics = await DevOps.find({ week }).lean();
    console.log('Found topics for week:', topics);
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics by week:', error);
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
    const { day, status } = req.body;
    console.log('Updating topic status:', { day, status });

    const result = await DevOps.findOneAndUpdate(
      { 'topics.day': day },
      { $set: { 'topics.$.status': status } },
      { new: true }
    );

    if (!result) {
      console.log('Topic not found:', day);
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    console.log('Topic updated successfully:', result);
    res.status(200).json({
      success: true,
      topic: result
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
    const topics = await DevOps.find().lean();
    
    const stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      byWeek: {}
    };

    topics.forEach(weekData => {
      if (!stats.byWeek[weekData.week]) {
        stats.byWeek[weekData.week] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          todo: 0
        };
      }

      weekData.topics.forEach(topic => {
        stats.total++;
        stats.byWeek[weekData.week].total++;

        switch (topic.status) {
          case 'completed':
            stats.completed++;
            stats.byWeek[weekData.week].completed++;
            break;
          case 'in-progress':
            stats.inProgress++;
            stats.byWeek[weekData.week].inProgress++;
            break;
          default:
            stats.todo++;
            stats.byWeek[weekData.week].todo++;
        }
      });
    });

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
