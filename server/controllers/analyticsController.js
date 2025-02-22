const DailyPlan = require('../models/DailyPlan');
const WeeklyPlan = require('../models/WeeklyPlan');
const DSAProblem = require('../models/DSAProblem');
const SystemDesignTopic = require('../models/SystemDesignTopic');
const { startOfWeek, endOfWeek, subWeeks } = require('date-fns');

exports.getProgressAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const fourWeeksAgo = subWeeks(today, 4);

    // Fetch DSA progress
    const dsaProblems = await DSAProblem.aggregate([
      {
        $match: {
          userId,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$category',
          completed: { $sum: 1 }
        }
      }
    ]);

    // Fetch System Design progress
    const systemDesignTopics = await SystemDesignTopic.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Fetch weekly completion rates
    const weeklyPlans = await WeeklyPlan.find({
      userId,
      weekStartDate: { $gte: fourWeeksAgo }
    });

    // Fetch time distribution
    const dailyPlans = await DailyPlan.find({
      userId,
      date: { $gte: startOfWeek(today), $lte: endOfWeek(today) }
    });

    // Process the data
    const dsaProgress = dsaProblems.map(item => ({
      category: item._id,
      completed: item.completed,
      total: getTotalProblemsForCategory(item._id)
    }));

    const systemDesignProgress = systemDesignTopics.map(item => ({
      name: item._id,
      value: item.count
    }));

    const weeklyCompletion = weeklyPlans.map(plan => ({
      week: plan.weekStartDate.toISOString().split('T')[0],
      completionRate: calculateCompletionRate(plan)
    }));

    const timeDistribution = calculateTimeDistribution(dailyPlans);

    res.status(200).json({
      success: true,
      data: {
        dsaProgress,
        systemDesignProgress,
        weeklyCompletion,
        timeDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};

// Helper functions
function getTotalProblemsForCategory(category) {
  // You can customize these numbers based on your curriculum
  const categoryTotals = {
    'Arrays': 24,
    'LinkedList': 18,
    'Trees': 20,
    'Graphs': 15,
    'DynamicProgramming': 30,
    'Recursion': 12,
    'Backtracking': 10,
    'Stack': 8,
    'Queue': 8,
    'Heap': 10
  };
  return categoryTotals[category] || 0;
}

function calculateCompletionRate(plan) {
  const totalGoals = plan.goals.reduce((acc, goal) => acc + goal.target, 0);
  const completedGoals = plan.goals.reduce((acc, goal) => acc + goal.completed, 0);
  return totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
}

function calculateTimeDistribution(dailyPlans) {
  const distribution = {
    'DSA': 0,
    'SystemDesign': 0,
    'Project': 0,
    'Content': 0
  };

  dailyPlans.forEach(plan => {
    plan.tasks.forEach(task => {
      if (task.timeSpent) {
        switch (task.type) {
          case 'DSA':
            distribution.DSA += task.timeSpent;
            break;
          case 'SYSTEM_DESIGN':
            distribution.SystemDesign += task.timeSpent;
            break;
          case 'PROJECT':
            distribution.Project += task.timeSpent;
            break;
          case 'CONTENT':
            distribution.Content += task.timeSpent;
            break;
        }
      }
    });
  });

  // Convert minutes to hours
  return Object.entries(distribution).map(([category, minutes]) => ({
    category,
    hours: Math.round(minutes / 60 * 10) / 10
  }));
}

module.exports = exports;
