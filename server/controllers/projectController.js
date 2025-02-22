const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const query = { user: req.user.id };

    // Apply filters
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;

    // Search by title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add task
exports.addTask = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.addTask(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.updateTaskStatus(req.params.taskId, req.body.status);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add work session
exports.addWorkSession = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.addWorkSession(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalTimeSpent: { $sum: '$timeSpent' },
          byType: {
            $push: {
              type: '$type',
              status: '$status'
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              status: '$status'
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalProjects: 0,
        completedProjects: 0,
        totalTimeSpent: 0,
        byType: {},
        byPriority: {}
      });
    }

    // Process type stats
    const typeStats = stats[0].byType.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = { total: 0, completed: 0 };
      }
      acc[curr.type].total++;
      if (curr.status === 'Completed') {
        acc[curr.type].completed++;
      }
      return acc;
    }, {});

    // Process priority stats
    const priorityStats = stats[0].byPriority.reduce((acc, curr) => {
      if (!acc[curr.priority]) {
        acc[curr.priority] = { total: 0, completed: 0 };
      }
      acc[curr.priority].total++;
      if (curr.status === 'Completed') {
        acc[curr.priority].completed++;
      }
      return acc;
    }, {});

    res.json({
      totalProjects: stats[0].totalProjects,
      completedProjects: stats[0].completedProjects,
      totalTimeSpent: stats[0].totalTimeSpent,
      byType: typeStats,
      byPriority: priorityStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
