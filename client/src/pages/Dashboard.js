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
  PencilIcon,
  TrashIcon
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
    dsaProblems: { 
      value: '0/0', 
      change: '+0 this week', 
      total: 0, 
      completed: 0, 
      inProgress: 0,
      todo: 0,
      weeklyTarget: 8,
      byDifficulty: {
        easy: { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        hard: { total: 0, completed: 0 }
      }
    },
    systemDesign: { 
      value: '0/0', 
      change: '+0 this week', 
      total: 0, 
      completed: 0, 
      inProgress: 0,
      todo: 0,
      weeklyTarget: 2 
    },
    devopsTasks: { 
      value: '0/0', 
      change: '+0 this week', 
      total: 0, 
      completed: 0, 
      inProgress: 0,
      todo: 0,
      weeklyTarget: 5 
    },
    learningHours: { 
      value: '0/0', 
      change: '+0 this week', 
      total: 0, 
      completed: 0, 
      weeklyTarget: 8 
    }
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

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    deadline: '',
    type: 'dsa',
    priority: 'medium',
    subtasks: []
  });

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
      const newStats = {
        dsaProblems: {
          value: `${statsData.dsaProblems.completed}/${statsData.dsaProblems.total}`,
          change: `+${statsData.dsaProblems.weeklyProgress} this week`,
          total: statsData.dsaProblems.total || 0,
          completed: statsData.dsaProblems.completed || 0,
          inProgress: statsData.dsaProblems.inProgress || 0,
          todo: statsData.dsaProblems.todo || 0,
          weeklyTarget: statsData.dsaProblems.weeklyTarget || 8,
          byDifficulty: statsData.dsaProblems.byDifficulty || {
            easy: { total: 0, completed: 0 },
            medium: { total: 0, completed: 0 },
            hard: { total: 0, completed: 0 }
          }
        },
        systemDesign: {
          value: `${statsData.systemDesign.completed}/${statsData.systemDesign.total}`,
          change: `+${statsData.systemDesign.weeklyProgress} this week`,
          total: statsData.systemDesign.total || 0,
          completed: statsData.systemDesign.completed || 0,
          inProgress: statsData.systemDesign.inProgress || 0,
          todo: statsData.systemDesign.todo || 0,
          weeklyTarget: statsData.systemDesign.weeklyTarget || 2
        },
        devopsTasks: {
          value: `${statsData.devopsTasks.completed}/${statsData.devopsTasks.total}`,
          change: `+${statsData.devopsTasks.weeklyProgress} this week`,
          total: statsData.devopsTasks.total || 0,
          completed: statsData.devopsTasks.completed || 0,
          inProgress: statsData.devopsTasks.inProgress || 0,
          todo: statsData.devopsTasks.todo || 0,
          weeklyTarget: statsData.devopsTasks.weeklyTarget || 5
        },
        learningHours: {
          value: `${statsData.learningHours.completed}/${statsData.learningHours.total}`,
          change: `+${statsData.learningHours.weeklyProgress} this week`,
          total: statsData.learningHours.total || 0,
          completed: statsData.learningHours.completed || 0,
          weeklyTarget: statsData.learningHours.weeklyTarget || 8
        }
      };

      console.log("newStats ,,, ", newStats)
      setStats(newStats);
    }

    // Fetch upcoming tasks
    const tasksData = await fetchData('http://localhost:5000/api/dashboard/upcoming-tasks', 'tasks');
    if (tasksData) {
      setUpcomingTasks(tasksData);
    }

    setLoading(false);
  };

  const fetchUpcomingTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      setSectionErrors(prev => ({ ...prev, tasks: true }));
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/dashboard/tasks', taskForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingTasks(prev => [...prev, response.data.task]);
        setIsAddTaskModalOpen(false);
        setTaskForm({
          title: '',
          deadline: '',
          type: 'dsa',
          priority: 'medium',
          subtasks: []
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/dashboard/tasks/${taskId}`, taskForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingTasks(prev => 
          prev.map(task => task._id === taskId ? response.data.task : task)
        );
        setEditingTask(null);
        setTaskForm({
          title: '',
          deadline: '',
          type: 'dsa',
          priority: 'medium',
          subtasks: []
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/dashboard/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingTasks(prev => prev.filter(task => task._id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/dashboard/tasks/${taskId}/subtasks/${subtaskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUpcomingTasks(prev => 
          prev.map(task => task._id === taskId ? response.data.task : task)
        );
      }
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  useEffect(() => {
    fetchUpcomingTasks();
  }, []);

  const handleAddTaskModalOpen = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      deadline: '',
      type: 'dsa',
      priority: 'medium',
      subtasks: []
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      deadline: task.deadline,
      type: task.type,
      priority: task.priority,
      subtasks: task.subtasks
    });
  };

  const handleTaskFormChange = (field, value) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskFormSubmit = async (event) => {
    event.preventDefault();
    if (editingTask) {
      await handleUpdateTask(editingTask._id);
    } else {
      await handleAddTask();
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
      total: 191,
      // total: stats.dsaProblems.total,
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
      total: 35,
      // total: stats.systemDesign.total,
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
      total: 30,
      // total: stats.devopsTasks.total,
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

  const DifficultyStats = ({ difficulty, stats = { total: 0, completed: 0 } }) => (
    <div className="flex flex-col items-center p-2">
      <div className="text-sm font-medium capitalize mb-1">{difficulty}</div>
      <div className="text-lg font-bold">{stats.completed}/{stats.total}</div>
    </div>
  );

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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - DSA Stats */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg col-span-1`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DSA Problems</h3>
              <div className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                {stats.dsaProblems.value}
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <CircularProgress value={stats.dsaProblems.completed} total={stats.dsaProblems.total} />
            </div>

            <div className="mb-6">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Weekly Progress</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {stats.dsaProblems.change}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target: {stats.dsaProblems.weeklyTarget}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(stats.dsaProblems.byDifficulty).map(([difficulty, data]) => (
                <div key={difficulty} className="text-center">
                  <div className={`text-sm font-medium mb-1 capitalize ${
                    difficulty === 'easy' ? 'text-green-500' :
                    difficulty === 'medium' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {difficulty}
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.completed}/{data.total}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Todo</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.dsaProblems.todo}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.dsaProblems.inProgress}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.dsaProblems.completed}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - System Design */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg col-span-1`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Design</h3>
              <div className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'}`}>
                {stats.systemDesign.value}
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <CircularProgress value={stats.systemDesign.completed} total={stats.systemDesign.total} />
            </div>

            <div className="mb-6">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Weekly Progress</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {stats.systemDesign.change}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target: {stats.systemDesign.weeklyTarget}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Todo</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.systemDesign.todo}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.systemDesign.inProgress}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.systemDesign.completed}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - DevOps Tasks */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg col-span-1`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DevOps Tasks</h3>
              <div className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-800'}`}>
                {stats.devopsTasks.value}
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <CircularProgress value={stats.devopsTasks.completed} total={stats.devopsTasks.total} />
            </div>

            <div className="mb-6">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Weekly Progress</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {stats.devopsTasks.change}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target: {stats.devopsTasks.weeklyTarget}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Todo</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.devopsTasks.todo}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.devopsTasks.inProgress}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</div>
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.devopsTasks.completed}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Upcoming Tasks
              </h2>
              <button
                onClick={handleAddTaskModalOpen}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {task.subtasks.map((subtask) => (
                        <div
                          key={subtask._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => handleToggleSubtask(task._id, subtask._id)}
                            className="rounded text-blue-600"
                          />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {subtask.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Task Modal */}
        {(isAddTaskModalOpen || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96`}>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskForm.title}
                  onChange={(e) => handleTaskFormChange('title', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => handleTaskFormChange('deadline', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                
                <select
                  value={taskForm.type}
                  onChange={(e) => handleTaskFormChange('type', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="dsa">DSA</option>
                  <option value="system_design">System Design</option>
                  <option value="devops">DevOps</option>
                </select>
                
                <select
                  value={taskForm.priority}
                  onChange={(e) => handleTaskFormChange('priority', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Subtasks
                  </h4>
                  {taskForm.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={subtask.name}
                        onChange={(e) => {
                          const newSubtasks = [...taskForm.subtasks];
                          newSubtasks[index].name = e.target.value;
                          handleTaskFormChange('subtasks', newSubtasks);
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        onClick={() => {
                          handleTaskFormChange('subtasks', taskForm.subtasks.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      handleTaskFormChange('subtasks', [...taskForm.subtasks, { name: '', completed: false }]);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Subtask
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={handleAddTaskModalClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTaskFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingTask ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
