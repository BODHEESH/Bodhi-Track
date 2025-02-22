const Resource = require('../models/Resource');

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const query = { user: req.user.id };

    // Apply filters
    if (req.query.category) query.category = req.query.category;
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.isFavorite) query.isFavorite = req.query.isFavorite === 'true';

    // Search by title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const resources = await Resource.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get resource by ID
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new resource
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.updateProgress(req.body.current);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.addReview(req.body);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.toggleFavorite();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Resource.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalResources: { $sum: 1 },
          completedResources: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          favoriteResources: {
            $sum: { $cond: ['$isFavorite', 1, 0] }
          },
          byCategory: {
            $push: {
              category: '$category',
              status: '$status',
              type: '$type'
            }
          },
          byType: {
            $push: {
              type: '$type',
              status: '$status',
              difficulty: '$difficulty'
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalResources: 0,
        completedResources: 0,
        favoriteResources: 0,
        byCategory: {},
        byType: {}
      });
    }

    // Process category stats
    const categoryStats = stats[0].byCategory.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = {
          total: 0,
          completed: 0,
          byType: {}
        };
      }
      acc[curr.category].total++;
      if (curr.status === 'Completed') {
        acc[curr.category].completed++;
      }

      if (!acc[curr.category].byType[curr.type]) {
        acc[curr.category].byType[curr.type] = 0;
      }
      acc[curr.category].byType[curr.type]++;

      return acc;
    }, {});

    // Process type stats
    const typeStats = stats[0].byType.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = {
          total: 0,
          completed: 0,
          byDifficulty: {}
        };
      }
      acc[curr.type].total++;
      if (curr.status === 'Completed') {
        acc[curr.type].completed++;
      }

      if (!acc[curr.type].byDifficulty[curr.difficulty]) {
        acc[curr.type].byDifficulty[curr.difficulty] = 0;
      }
      acc[curr.type].byDifficulty[curr.difficulty]++;

      return acc;
    }, {});

    res.json({
      totalResources: stats[0].totalResources,
      completedResources: stats[0].completedResources,
      favoriteResources: stats[0].favoriteResources,
      byCategory: categoryStats,
      byType: typeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
