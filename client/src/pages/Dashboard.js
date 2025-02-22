import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import {
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  BoltIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const CircularProgress = ({ value, total }) => {
  const percentage = (value / total) * 100;
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
        <circle
          className="text-indigo-500 transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-sm text-gray-500">/{total}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    dsaProblems: { value: '0/0', change: '+0 this week', total: 0, completed: 0, pending: 0, weeklyTarget: 8 },
    systemDesign: { value: '0/0', change: '+0 this week', total: 0, completed: 0, pending: 0, weeklyTarget: 2 },
    devopsTasks: { value: '0/0', change: '+0 this week', total: 0, completed: 0, pending: 0, weeklyTarget: 5 },
    learningHours: { value: '0/0', change: '+0 this week', total: 0, completed: 0, pending: 0, weeklyTarget: 8 }
  });
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [learningProgress, setLearningProgress] = useState({
    dsa: { completed: 0, total: 0, categories: [] },
    devops: { completed: 0, total: 0, categories: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionErrors, setSectionErrors] = useState({
    stats: false,
    achievements: false,
    activity: false,
    tasks: false,
    progress: false
  });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Helper function to handle API calls
    const fetchData = async (url, errorKey) => {
      try {
        const response = await axios.get(url, { headers });
        console.log("response from fetch data:", response)
        if (response.data.success) {
          return response.data.data;
        }
        throw new Error('API response not successful');
      } catch (error) {
        console.error(`Error fetching ${errorKey}:`, error);
        setSectionErrors(prev => ({ ...prev, [errorKey]: true }));
        return null;
      }
    };

    // Fetch stats
    const statsData = await fetchData('http://localhost:5000/api/dashboard/stats', 'stats');
    console.log("statsData ,,, ", statsData)
    if (statsData) {
      const newStats = {};
      Object.keys(statsData).forEach(key => {
        const stat = statsData[key];
        newStats[key] = {
          ...stat,
          value: `${stat.completed}/${stat.total}`,
          change: `+${stat.weeklyProgress} this week`
        };
      });

      console.log("newStats ,,, ", newStats)
      setStats(newStats);
    }

    // // Fetch achievements
    // const achievementsData = await fetchData('http://localhost:5000/api/dashboard/achievements', 'achievements');
    // if (achievementsData) {
    //   setAchievements(achievementsData);
    // }

    // // Fetch recent activity
    // const activityData = await fetchData('http://localhost:5000/api/dashboard/recent-activity', 'activity');
    // if (activityData) {
    //   setRecentActivity(activityData);
    // }

    // // Fetch upcoming tasks
    // const tasksData = await fetchData('http://localhost:5000/api/dashboard/upcoming-tasks', 'tasks');
    // if (tasksData) {
    //   setUpcomingTasks(tasksData);
    // }

    // // Fetch learning progress
    // const progressData = await fetchData('http://localhost:5000/api/dashboard/learning-progress', 'progress');
    // if (progressData) {
    //   setLearningProgress(progressData);
    // }

    setLoading(false);
  };

  const handleAddTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/dashboard/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setShowToast(true);
        setToastMessage({ type: 'success', text: 'Task added successfully!' });
        setShowModal(false);
        // Only refresh tasks section instead of all data
        const tasksData = await axios.get('http://localhost:5000/api/dashboard/upcoming-tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (tasksData.data.success) {
          setUpcomingTasks(tasksData.data.data);
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setShowToast(true);
      setToastMessage({ type: 'error', text: 'Failed to add task. Please try again.' });
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/dashboard/tasks/${taskId}/subtasks/${subtaskId}`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Only refresh tasks section instead of all data
      const tasksData = await axios.get('http://localhost:5000/api/dashboard/upcoming-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (tasksData.data.success) {
        setUpcomingTasks(tasksData.data.data);
        setShowToast(true);
        setToastMessage({ type: 'success', text: 'Task updated successfully!' });
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      setShowToast(true);
      setToastMessage({ type: 'error', text: 'Failed to update task. Please try again.' });
    }
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className={`p-4 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
      <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
        {message}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  const statsConfig = [
    { 
      name: 'DSA Problems', 
      key: 'dsaProblems',
      value: stats.dsaProblems.value, 
      icon: <BoltIcon className="w-8 h-8" />, 
      change: stats.dsaProblems.change,
      completed: stats.dsaProblems.completed,
      total: stats.dsaProblems.total,
      pending: stats.dsaProblems.pending,
      gradient: 'from-blue-500 to-indigo-600',
      ringColor: 'text-blue-500',
      iconGradient: 'from-blue-400 to-indigo-500',
      weeklyTarget: stats.dsaProblems.weeklyTarget

    },
    { 
      name: 'System Design',
      key: 'systemDesign', 
      value: stats.systemDesign.value, 
      icon: <RocketLaunchIcon className="w-8 h-8" />, 
      change: stats.systemDesign.change,
      completed: stats.systemDesign.completed,
      total: stats.systemDesign.total,
      pending: stats.systemDesign.pending,
      gradient: 'from-purple-500 to-pink-600',
      ringColor: 'text-purple-500',
      iconGradient: 'from-purple-400 to-pink-500',
      weeklyTarget: stats.systemDesign.weeklyTarget
    },
    { 
      name: 'DevOps Tasks',
      key: 'devopsTasks', 
      value: stats.devopsTasks.value, 
      icon: <ChartBarIcon className="w-8 h-8" />, 
      change: stats.devopsTasks.change,
      completed: stats.devopsTasks.completed,
      total: stats.devopsTasks.total,
      pending: stats.devopsTasks.pending,
      gradient: 'from-emerald-500 to-teal-600',
      ringColor: 'text-emerald-500',
      iconGradient: 'from-emerald-400 to-teal-500',
      weeklyTarget: stats.devopsTasks.weeklyTarget
    },
    { 
      name: 'Learning Hours',
      key: 'learningHours', 
      value: stats.learningHours.value, 
      icon: <ClockIcon className="w-8 h-8" />, 
      change: stats.learningHours.change,
      completed: stats.learningHours.completed,
      total: stats.learningHours.total,
      pending: stats.learningHours.pending,
      gradient: 'from-orange-500 to-red-600',
      ringColor: 'text-orange-500',
      iconGradient: 'from-orange-400 to-red-500'
    }
  ];



  
  const getStatKey = (name) => {
    return name.toLowerCase().replace(/\s+/g, '');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      {/* Theme Toggle Button */}
      {/* <div className="fixed left-4 top-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-500' 
              : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
          }`}
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-8`}>
          Dashboard Overview
        </h2>

{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
  {statsConfig.map((item, index) => (
    <div
      key={index}
      className={`relative overflow-hidden rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.gradient}`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${item.iconGradient}`}>
            {item.icon}
          </div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.name}
          </h3>
        </div>

        {/* Progress and Stats */}
        <div className="flex items-center justify-between">
          <div className={item.ringColor}>
            <CircularProgress value={item.completed} total={item.total} size={50} strokeWidth={6} />
          </div>
          
          <div className="ml-3">
            <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              {item.completed}
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                /{item.total}
              </span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
              Weekly Target: <span className="font-semibold">{item.weeklyTarget}</span>
            </div>
            <div className="flex items-center">
              <div className="text-xs font-medium text-emerald-400">
                {item.change}
              </div>
              <div className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {item.pending} pending
              </div>
            </div>
          </div>
        </div>
      </div>
      {sectionErrors.stats && <ErrorMessage message="Error fetching stats" />}
    </div>
  ))}
</div>


        {/* Achievements Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Achievements
          </h3>
          {sectionErrors.achievements && <ErrorMessage message="Error fetching achievements" />}
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center space-x-4 p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              } rounded-lg`}>
                <div className="flex-shrink-0">
                  <TrophyIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                    {achievement.title}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-emerald-500">
                  +{achievement.points} points
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Learning Progress
          </h3>
          {sectionErrors.progress && <ErrorMessage message="Error fetching learning progress" />}
          <div className="space-y-6">
            <div>
              <h4 className={`text-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>DSA Progress</h4>
              <div className="space-y-2">
                {learningProgress.dsa.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{category.name}</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{category.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className={`text-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>DevOps Progress</h4>
              <div className="space-y-2">
                {learningProgress.devops.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{category.name}</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{category.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className="p-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Recent Activity
            </h2>
            {sectionErrors.activity && <ErrorMessage message="Error fetching recent activity" />}
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } rounded-lg`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.description}
                    </p>
                    <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Upcoming Tasks
              </h2>
              <button
                className={`px-4 py-2 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'} rounded-lg hover:bg-indigo-700`}
                onClick={() => setShowModal(true)}
              >
                Add Task
              </button>
            </div>
            {sectionErrors.tasks && <ErrorMessage message="Error fetching upcoming tasks" />}
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="border-b border-gray-600 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="space-y-2">
                    {task.subtasks.map((subtask, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(task._id, subtask._id, !subtask.completed)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={subtask.completed ? 'line-through text-gray-500' : `${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          {subtask.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Add New Task
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddTask({
                  title: formData.get('title'),
                  type: formData.get('type'),
                  priority: formData.get('priority'),
                  deadline: formData.get('deadline'),
                  subtasks: formData.get('subtasks').split('\n').filter(Boolean).map(name => ({ name }))
                });
              }}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    required
                    className={`w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  />
                  <select
                    name="type"
                    required
                    className={`w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  >
                    <option value="">Select Type</option>
                    <option value="DSA">DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Learning">Learning</option>
                  </select>
                  <select
                    name="priority"
                    required
                    className={`w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    type="date"
                    name="deadline"
                    required
                    className={`w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  />
                  <textarea
                    name="subtasks"
                    placeholder="Enter subtasks (one per line)"
                    required
                    rows="4"
                    className={`w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  ></textarea>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-700'} rounded-lg hover:bg-gray-600`}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'} rounded-lg hover:bg-indigo-700`}
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
