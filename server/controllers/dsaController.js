const DSAProblem = require('../models/DSAProblem');
const Activity = require('../models/Activity');

// Get all DSA problems
exports.getAllProblems = async (req, res) => {
  try {
    console.log('Fetching all DSA problems...');
    const problems = await DSAProblem.find().sort('day');
    console.log('Found problems:', problems.length);
    res.status(200).json({
      success: true,
      data: problems
    });
  } catch (error) {
    console.error('Error fetching DSA problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
};

// Get problem by day
exports.getProblemsByDay = async (req, res) => {
  try {
    const { day } = req.params;
    console.log('Fetching problems for day:', day);
    const problems = await DSAProblem.find({ day: parseInt(day) });
    console.log('Found problems:', problems);
    
    if (!problems || problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Problems not found for this day'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problems
    });
  } catch (error) {
    console.error('Error fetching problems by day:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
};

// Update problem status
exports.updateProblemStatus = async (req, res) => {
  try {
    const { problemId, status } = req.body;
    const userId = req.user.id;
    console.log('Updating problem status:', { problemId, status, userId });

    // Find the document containing the problem and update its status
    const result = await DSAProblem.findOneAndUpdate(
      { 'problems._id': problemId },
      { 
        $set: { 
          'problems.$.status': status,
          'problems.$.updatedAt': new Date()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Find the updated problem from the problems array
    const updatedProblem = result.problems.find(p => p._id.toString() === problemId);

    // Create activity log with all required fields
    await Activity.create({
      userId,
      type: 'DSA', // Uppercase to match enum
      title: `Updated problem status`,
      description: `Changed status of "${updatedProblem.title}" to ${status}`,
      difficulty: updatedProblem.difficulty.charAt(0).toUpperCase() + updatedProblem.difficulty.slice(1), // Capitalize first letter
      details: {
        problemId: updatedProblem._id,
        problemTitle: updatedProblem.title,
        newStatus: status
      }
    });

    res.status(200).json({
      success: true,
      message: 'Problem status updated successfully',
      data: updatedProblem
    });

  } catch (error) {
    console.error('Error updating problem status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating problem status',
      error: error.message
    });
  }
};

// Get progress statistics
exports.getStatistics = async (req, res) => {
  try {
    console.log('Fetching DSA statistics...');
    const problems = await DSAProblem.find();
    
    const stats = {
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

    // Calculate stats from nested problems
    problems.forEach(day => {
      if (day.problems && Array.isArray(day.problems)) {
        day.problems.forEach(problem => {
          stats.totalProblems++;
          
          // Update difficulty stats
          const difficulty = problem.difficulty.toLowerCase();
          if (stats.byDifficulty[difficulty]) {
            stats.byDifficulty[difficulty].total++;
          }
          
          // Update status stats
          switch (problem.status) {
            case 'completed':
              stats.completed++;
              if (stats.byDifficulty[difficulty]) {
                stats.byDifficulty[difficulty].completed++;
              }
              break;
            case 'in-progress':
              stats.inProgress++;
              break;
            default:
              stats.todo++;
          }
        });
      }
    });

    console.log('DSA statistics:', stats);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
};
