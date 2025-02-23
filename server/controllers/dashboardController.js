const mongoose = require('mongoose');
const User = require('../models/User');
const DSAProblem = require('../models/DSAProblem');
const SystemDesign = require('../models/SystemDesign');
const DevOps = require('../models/DevOps');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');

// Get all dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get stats
    const stats = await exports.getStats(req, res);
    
    // Get achievements
    const achievements = await Achievement.find({ userId })
      .sort('-createdAt')
      .limit(5)
      .lean();
    
    // Get recent activity
    const recentActivity = await Activity.find({ userId })
      .sort('-createdAt')
      .limit(10)
      .lean();
    
    // Get upcoming tasks
    const upcomingTasks = await Task.find({
      userId,
      dueDate: { $gte: new Date() }
    })
    .sort('dueDate')
    .limit(5)
    .lean();
    
    // Get learning progress
    const learningProgress = await exports.getLearningProgress(req, res);
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        achievements,
        recentActivity,
        upcomingTasks,
        learningProgress
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard data',
      error: error.message
    });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  // console.log("get status started---------------------")
  try {
    const userId = req.user.id;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    console.log("user id and one week ago", userId, oneWeekAgo)

    console.log('Fetching DSA statistics...');
    const problems = await DSAProblem.find();
    
    const dsaStatsData = {
      totalProblems: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      byDifficulty: {
        easy: { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        hard: { total: 0, completed: 0 }
      }
    };

    // console.log("dsa stats data", dsaStatsData)

     // Calculate stats from nested problems
     problems.forEach(day => {
      if (day.problems && Array.isArray(day.problems)) {
        day.problems.forEach(problem => {
          dsaStatsData.totalProblems++;
          
          // Update difficulty stats
          const difficulty = problem.difficulty.toLowerCase();
          if (dsaStatsData.byDifficulty[difficulty]) {
            dsaStatsData.byDifficulty[difficulty].total++;
          }
          
          // Update status stats
          switch (problem.status) {
            case 'completed':
              dsaStatsData.completed++;
              if (dsaStatsData.byDifficulty[difficulty]) {
                dsaStatsData.byDifficulty[difficulty].completed++;
              }
              break;
            case 'in-progress':
              dsaStatsData.inProgress++;
              break;
            default:
              dsaStatsData.todo++;
          }
        });
      }
    });

    // console.log('DSA statistics:', dsaStatsData);

    // Get user data with targets
    const userData = await User.findById(userId)
      .select('targets learningHours')
      .lean();
    // console.log("user data", userData)

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get DSA stats with difficulty breakdown
    const dsaStats = await DSAProblem.aggregate([
      // First unwind the problems array to work with individual problems
      { $unwind: "$problems" },
      {
        $facet: {
          'total': [
            { $count: 'count' }
          ],
          'completed': [
            { $match: { "problems.status": "completed" } },
            { $count: 'count' }
          ],
          'inProgress': [
            { $match: { "problems.status": "in-progress" } },
            { $count: 'count' }
          ],
          'weeklyProgress': [
            {
              $match: {
                "problems.status": "completed",
                updatedAt: { $gte: oneWeekAgo }
              }
            },
            { $count: 'count' }
          ],
          'byDifficulty': [
            {
              $group: {
                _id: "$problems.difficulty",
                total: { $sum: 1 },
                completed: {
                  $sum: {
                    $cond: [{ $eq: ["$problems.status", "completed"] }, 1, 0]
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    // console.log("Raw DSA Stats:", JSON.stringify(dsaStats, null, 2));

    // Helper function to extract counts from aggregation results with proper defaults
    const extractCounts = (stats) => {
      const result = stats[0] || {};
      return {
        total: (result.total && result.total[0] && result.total[0].count) || 0,
        completed: (result.completed && result.completed[0] && result.completed[0].count) || 0,
        inProgress: (result.inProgress && result.inProgress[0] && result.inProgress[0].count) || 0,
        weeklyProgress: (result.weeklyProgress && result.weeklyProgress[0] && result.weeklyProgress[0].count) || 0
      };
    };

    // Extract all stats
    const dsa = extractCounts(dsaStats);
    
    // Get DevOps stats
    const devOpsDoc = await DevOps.findOne();
    const devOps = {
      total: 0,
      completed: 0,
      inProgress: 0,
      weeklyProgress: 0,
      todo: 0
    };

    if (devOpsDoc && devOpsDoc.topics) {
      devOps.total = devOpsDoc.topics.length;
      devOps.completed = devOpsDoc.topics.filter(t => t.status === 'completed').length;
      devOps.inProgress = devOpsDoc.topics.filter(t => t.status === 'in-progress').length;
      devOps.todo = devOps.total - (devOps.completed + devOps.inProgress);
      devOps.weeklyProgress = devOpsDoc.topics.filter(t => 
        t.status === 'completed' && 
        new Date(devOpsDoc.updatedAt) >= oneWeekAgo
      ).length;
    }

    console.log("DevOps Document:", devOpsDoc);
    console.log("DevOps Stats:", JSON.stringify(devOps, null, 2));

    // Get system design stats
    const systemDesignDoc = await SystemDesign.findOne();
    // console.log("system design doc ", systemDesignDoc)
    const systemDesign = {
      total: 0,
      completed: 0,
      inProgress: 0,
      weeklyProgress: 0,
      todo: 0
    };

    if (systemDesignDoc && systemDesignDoc.topics) {
      systemDesign.total = systemDesignDoc.topics.length;
      systemDesign.completed = systemDesignDoc.topics.filter(t => t.status === 'completed').length;
      systemDesign.inProgress = systemDesignDoc.topics.filter(t => t.status === 'in-progress').length;
      systemDesign.todo = systemDesign.total - (systemDesign.completed + systemDesign.inProgress);
      systemDesign.weeklyProgress = systemDesignDoc.topics.filter(t => 
        t.status === 'completed' && 
        new Date(systemDesignDoc.updatedAt) >= oneWeekAgo
      ).length;
    }

    // console.log('System Design Document:', systemDesignDoc);
    // console.log('System Design Stats:', systemDesign);

    // Process DSA difficulty stats
    const difficultyStats = {};
    if (dsaStats[0] && dsaStats[0].byDifficulty) {
      dsaStats[0].byDifficulty.forEach(stat => {
        if (stat._id) {
          difficultyStats[stat._id.toLowerCase()] = {
            total: stat.total || 0,
            completed: stat.completed || 0
          };
        }
      });
    }

    // Ensure all difficulty levels exist with default values
    const defaultDifficulties = ['easy', 'medium', 'hard'];
    defaultDifficulties.forEach(diff => {
      if (!difficultyStats[diff]) {
        difficultyStats[diff] = { total: 0, completed: 0 };
      }
    });

    // Calculate learning hours (implement based on your tracking mechanism)
    const learningHours = {
      total: userData.learningHours?.total || 0,
      completed: userData.learningHours?.completed || 0,
      weeklyProgress: userData.learningHours?.weeklyProgress || 0
    };

    // Prepare response with formatted values
    const stats = {
      dsaProblems: {
        ...dsa,
        todo: Math.max(0, dsa.total - (dsa.completed + dsa.inProgress)),
        byDifficulty: difficultyStats,
        weeklyTarget: userData.targets?.dsa?.weekly || 8,
        value: `${dsa.completed}/${dsa.total}`,
        change: `+${dsa.weeklyProgress} this week`
      },
      systemDesign: {
        ...systemDesign,
        weeklyTarget: userData.targets?.systemDesign?.weekly || 2,
        value: `${systemDesign.completed}/${systemDesign.total}`,
        change: `+${systemDesign.weeklyProgress} this week`
      },
      devopsTasks: {
        ...devOps,
        todo: Math.max(0, devOps.total - (devOps.completed + devOps.inProgress)),
        weeklyTarget: userData.targets?.devops?.weekly || 5,
        value: `${devOps.completed}/${devOps.total}`,
        change: `+${devOps.weeklyProgress} this week`
      },
      learningHours: {
        ...learningHours,
        weeklyTarget: userData.targets?.learningHours?.weekly || 8,
        value: `${learningHours.completed}/${learningHours.total}`,
        change: `+${learningHours.weeklyProgress} this week`
      }
    };
// console.log("final status for checking,::", stats);
    console.log("Final stats:", JSON.stringify(stats, null, 2));

    if (!res.headersSent) {
      res.json({
        success: true,
        data: stats
      });
    }

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard stats'
    });
  }
};

// Get achievements
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await Achievement.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting achievements'
    });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error getting recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recent activity'
    });
  }
};

// Get upcoming tasks
exports.getUpcomingTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({
      userId,
      deadline: { $gte: new Date() }
    })
    .sort({ deadline: 1 })
    .limit(5)
    .lean();

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error getting upcoming tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting upcoming tasks'
    });
  }
};

// Get learning progress
exports.getLearningProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get DSA progress by category
    const dsaProgress = await DSAProblem.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$topics' },
      {
        $group: {
          _id: '$topics.category',
          completed: {
            $sum: { $cond: [{ $eq: ['$topics.status', 'completed'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    // Get DevOps progress by category
    const devopsProgress = await DevOps.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$topics' },
      {
        $group: {
          _id: '$topics.category',
          completed: {
            $sum: { $cond: [{ $eq: ['$topics.status', 'completed'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    const progress = {
      dsa: {
        categories: dsaProgress.map(cat => ({
          name: cat._id,
          progress: Math.round((cat.completed / cat.total) * 100)
        })),
        completed: dsaProgress.reduce((sum, cat) => sum + cat.completed, 0),
        total: dsaProgress.reduce((sum, cat) => sum + cat.total, 0)
      },
      devops: {
        categories: devopsProgress.map(cat => ({
          name: cat._id,
          progress: Math.round((cat.completed / cat.total) * 100)
        })),
        completed: devopsProgress.reduce((sum, cat) => sum + cat.completed, 0),
        total: devopsProgress.reduce((sum, cat) => sum + cat.total, 0)
      }
    };

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error getting learning progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting learning progress'
    });
  }
};

// Add new task
exports.addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, type, priority, deadline, subtasks } = req.body;

    const task = new Task({
      userId,
      title,
      type,
      priority,
      deadline: new Date(deadline),
      subtasks: subtasks.map(st => ({
        name: st.name,
        completed: false
      }))
    });

    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding task'
    });
  }
};

// Update subtask status
exports.updateSubtaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, subtaskId } = req.params;
    const { completed } = req.body;

    const task = await Task.findOne({ _id: taskId, userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    subtask.completed = completed;
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating subtask status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subtask status'
    });
  }
};

// Update user stats
exports.updateStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stats } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { stats } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.stats
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stats'
    });
  }
};

// Add new achievement
exports.addAchievement = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievement = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { achievements: achievement } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: user.achievements
    });
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding achievement'
    });
  }
};

// Add recent activity
exports.addActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activity = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          recentActivity: {
            $each: [activity],
            $position: 0,
            $slice: 10 // Keep only the 10 most recent activities
          }
        }
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: user.recentActivity
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding activity'
    });
  }
};

// Update learning progress
exports.updateLearningProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { learningProgress } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { learningProgress } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.learningProgress
    });
  } catch (error) {
    console.error('Error updating learning progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating learning progress'
    });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, subtaskId, completed } = req.body;

    const user = await User.findOneAndUpdate(
      { 
        _id: userId,
        'upcomingTasks._id': taskId,
        'upcomingTasks.subtasks._id': subtaskId
      },
      { 
        $set: { 
          'upcomingTasks.$.subtasks.$[subtask].completed': completed 
        }
      },
      { 
        new: true,
        arrayFilters: [{ 'subtask._id': subtaskId }]
      }
    );

    res.status(200).json({
      success: true,
      data: user.upcomingTasks
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status'
    });
  }
};

// Update learning hours
exports.updateLearningHours = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hours } = req.body;

    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get one week ago
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Update user's learning hours
    const user = await User.findById(userId);
    
    // Add to history
    user.learningHours.history.push({
      date: today,
      hours: hours
    });

    // Update total hours
    user.learningHours.total += hours;

    // Calculate this week's hours
    const thisWeekHours = user.learningHours.history
      .filter(record => record.date >= oneWeekAgo)
      .reduce((sum, record) => sum + record.hours, 0);

    user.learningHours.thisWeek = thisWeekHours;

    await user.save();

    res.status(200).json({
      success: true,
      data: user.learningHours
    });
  } catch (error) {
    console.error('Error updating learning hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating learning hours'
    });
  }
};

// Update targets
exports.updateTargets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targets } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { targets } },
      { new: true }
    ).select('targets');

    res.status(200).json({
      success: true,
      data: user.targets
    });
  } catch (error) {
    console.error('Error updating targets:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating targets'
    });
  }
};
