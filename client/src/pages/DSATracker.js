import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const DSATracker = () => {
  const { isDarkMode } = useTheme();
  const [dsaData, setDsaData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: 'success', text: '' });

  useEffect(() => {
    fetchDSAData();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dsa/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status == 200) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error fetching statistics');
    }
  };

  const fetchDSAData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dsa', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch DSA data');
      }

      // Transform the data to include all necessary fields
      const transformedData = response.data.data.map(day => ({
        ...day,
        problems: day.problems.map(problem => ({
          ...problem,
          day: day.day,
          dayTitle: day.title
        }))
      }));

      // Flatten the problems array
      const allProblems = transformedData.flatMap(day => day.problems);
      
      setDsaData(allProblems);
      setLoading(false);
    } catch (err) {
      setError('Error fetching DSA problems');
      setLoading(false);
      console.error('Error:', err);
    } 
  };

  const updateProblemStatus = async (problemId, newStatus) => {
    console.log("problemId, newStatus", problemId, newStatus)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:5000/api/dsa/status', 
        { problemId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        // Update local state
        setDsaData(prevData => 
          prevData.map(problem => 
            problem._id === problemId 
              ? { ...problem, status: newStatus }
              : problem
          )
        );
        // Show success toast
        setToastMessage({ type: 'success', text: 'Problem status updated successfully!' });
        setShowToast(true);
        // Refresh stats
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating problem status:', err);
      setToastMessage({ type: 'error', text: 'Failed to update problem status' });
      setShowToast(true);
    }
  };

  const filteredProblems = dsaData.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || problem.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold">Total Problems</h3>
            <span className="text-xl sm:text-2xl font-bold">{stats.totalProblems}</span>
          </div>
        </div>
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold">Completed</h3>
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-green-500">{stats.completed}</span>
            </div>
          </div>
        </div>
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold">In Progress</h3>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.inProgress}</span>
            </div>
          </div>
        </div>
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold">Todo</h3>
            <div className="flex items-center">
              <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-gray-500">{stats.totalProblems - stats.completed - stats.inProgress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search problems..."
            className={`w-full px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 placeholder-gray-400'
                : 'bg-white text-gray-900 placeholder-gray-500'
            } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 text-gray-100'
                : 'bg-white text-gray-900'
            } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Problems</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="todo">Todo</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className={`-mx-4 sm:mx-0 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProblems.map((problem) => (
                <tr key={problem._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Day {problem.day}</div>
                    <div className="sm:hidden mt-1 text-xs text-gray-500">
                      {problem.title} • {problem.topic}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {problem.title}
                    </a>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {problem.topic}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <select
                      value={problem.status}
                      onChange={(e) => updateProblemStatus(problem._id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium ${getStatusColor(problem.status)}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
          toastMessage.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
};

export default DSATracker;
