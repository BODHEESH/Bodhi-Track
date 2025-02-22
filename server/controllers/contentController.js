const Content = require('../models/Content');

// Get all content for a user
exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find({ user: req.user.id });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get content by platform
exports.getContentByPlatform = async (req, res) => {
  try {
    const content = await Content.find({
      user: req.user.id,
      platform: req.params.platform
    });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new content
exports.createContent = async (req, res) => {
  try {
    const content = new Content({
      ...req.body,
      user: req.user.id
    });
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    Object.assign(content, req.body);
    content.lastUpdated = new Date();
    
    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update content status
exports.updateStatus = async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const updatedContent = await content.updateStatus(req.body.status);
    res.json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update content analytics
exports.updateAnalytics = async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    content.analytics = {
      ...content.analytics,
      ...req.body
    };
    
    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update task status
exports.updateTask = async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const task = content.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = req.body.completed;
    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get content statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Content.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$platform',
          total: { $sum: 1 },
          published: {
            $sum: {
              $cond: [{ $eq: ['$status', 'published'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0]
            }
          },
          draft: {
            $sum: {
              $cond: [{ $eq: ['$status', 'draft'] }, 1, 0]
            }
          },
          totalViews: { $sum: '$analytics.views' },
          totalLikes: { $sum: '$analytics.likes' },
          totalReactions: { $sum: '$analytics.reactions' }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
