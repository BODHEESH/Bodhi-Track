const DailyPlan = require('../models/DailyPlan');
const WeeklyPlan = require('../models/WeeklyPlan');

// Daily Plan Controllers
exports.createDailyPlan = async (req, res) => {
  try {
    const { date, tasks } = req.body;
    const userId = req.user._id;

    // Check if plan already exists for this date
    const existingPlan = await DailyPlan.findOne({ userId, date });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Plan already exists for this date'
      });
    }

    const dailyPlan = new DailyPlan({
      userId,
      date,
      tasks,
      metrics: calculateDailyMetrics(tasks)
    });

    await dailyPlan.save();

    res.status(201).json({
      success: true,
      data: dailyPlan
    });
  } catch (error) {
    console.error('Error creating daily plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating daily plan'
    });
  }
};

exports.updateDailyPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    const dailyPlan = await DailyPlan.findOne({ _id: planId, userId });
    if (!dailyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Daily plan not found'
      });
    }

    // Update tasks and recalculate metrics
    if (updates.tasks) {
      updates.metrics = calculateDailyMetrics(updates.tasks);
    }

    Object.assign(dailyPlan, updates);
    await dailyPlan.save();

    res.status(200).json({
      success: true,
      data: dailyPlan
    });
  } catch (error) {
    console.error('Error updating daily plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating daily plan'
    });
  }
};

exports.getDailyPlan = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    const dailyPlan = await DailyPlan.findOne({ userId, date });
    if (!dailyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Daily plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dailyPlan
    });
  } catch (error) {
    console.error('Error fetching daily plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily plan'
    });
  }
};

// Weekly Plan Controllers
exports.createWeeklyPlan = async (req, res) => {
  try {
    const { weekStartDate, goals } = req.body;
    const userId = req.user._id;

    // Calculate week end date
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Check if plan already exists for this week
    const existingPlan = await WeeklyPlan.findOne({ userId, weekStartDate });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Plan already exists for this week'
      });
    }

    const weeklyPlan = new WeeklyPlan({
      userId,
      weekStartDate,
      weekEndDate,
      goals,
      metrics: calculateWeeklyMetrics(goals)
    });

    await weeklyPlan.save();

    res.status(201).json({
      success: true,
      data: weeklyPlan
    });
  } catch (error) {
    console.error('Error creating weekly plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating weekly plan'
    });
  }
};

exports.updateWeeklyPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    const weeklyPlan = await WeeklyPlan.findOne({ _id: planId, userId });
    if (!weeklyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Weekly plan not found'
      });
    }

    // Update goals and recalculate metrics
    if (updates.goals) {
      updates.metrics = calculateWeeklyMetrics(updates.goals);
    }

    Object.assign(weeklyPlan, updates);
    await weeklyPlan.save();

    res.status(200).json({
      success: true,
      data: weeklyPlan
    });
  } catch (error) {
    console.error('Error updating weekly plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating weekly plan'
    });
  }
};

exports.getWeeklyPlan = async (req, res) => {
  try {
    const { weekStartDate } = req.query;
    const userId = req.user._id;

    const weeklyPlan = await WeeklyPlan.findOne({ userId, weekStartDate })
      .populate('dailyPlans');

    if (!weeklyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Weekly plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: weeklyPlan
    });
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly plan'
    });
  }
};

// Helper functions
function calculateDailyMetrics(tasks) {
  const metrics = {
    dsaProblems: { planned: 0, completed: 0 },
    systemDesign: { planned: 0, completed: 0 },
    projectWork: { planned: 0, completed: 0 },
    contentCreation: { planned: 0, completed: 0 }
  };

  tasks.forEach(task => {
    switch (task.type) {
      case 'DSA':
        metrics.dsaProblems.planned++;
        if (task.status === 'COMPLETED') metrics.dsaProblems.completed++;
        break;
      case 'SYSTEM_DESIGN':
        metrics.systemDesign.planned++;
        if (task.status === 'COMPLETED') metrics.systemDesign.completed++;
        break;
      case 'PROJECT':
        metrics.projectWork.planned += task.scheduledTime ? 
          (task.scheduledTime.end - task.scheduledTime.start) / (1000 * 60) : 0;
        metrics.projectWork.completed += task.timeSpent || 0;
        break;
      case 'CONTENT':
        metrics.contentCreation.planned += task.scheduledTime ? 
          (task.scheduledTime.end - task.scheduledTime.start) / (1000 * 60) : 0;
        metrics.contentCreation.completed += task.timeSpent || 0;
        break;
    }
  });

  return metrics;
}

function calculateWeeklyMetrics(goals) {
  const metrics = {
    dsaProblems: { target: 0, completed: 0 },
    systemDesign: { topics: 0, completed: 0 },
    projectProgress: { plannedHours: 0, actualHours: 0 },
    contentCreation: { blogs: 0, videos: 0 }
  };

  goals.forEach(goal => {
    switch (goal.category) {
      case 'DSA':
        metrics.dsaProblems.target = goal.target;
        metrics.dsaProblems.completed = goal.completed;
        break;
      case 'SYSTEM_DESIGN':
        metrics.systemDesign.topics = goal.target;
        metrics.systemDesign.completed = goal.completed;
        break;
      case 'PROJECT':
        metrics.projectProgress.plannedHours = goal.target;
        metrics.projectProgress.actualHours = goal.completed;
        break;
      case 'CONTENT':
        metrics.contentCreation.blogs = goal.target;
        metrics.contentCreation.videos = goal.completed;
        break;
    }
  });

  return metrics;
}

module.exports = exports;
