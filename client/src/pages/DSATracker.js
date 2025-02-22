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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Total Problems</h3>
            <span className="text-2xl font-bold">{stats.totalProblems}</span>
          </div>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Completed</h3>
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-500">{stats.completed}</span>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">In Progress</h3>
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold text-yellow-500">{stats.inProgress}</span>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Todo</h3>
            <div className="flex items-center">
              <XCircleIcon className="w-6 h-6 text-gray-500 mr-2" />
              <span className="text-2xl font-bold text-gray-500">{stats.totalProblems - stats.completed - stats.inProgress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'in-progress'
                ? 'bg-yellow-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'todo'
                ? 'bg-gray-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => setFilter('todo')}
          >
            Todo
          </button>
        </div>
      </div>

      {/* Problems Table */}
      <div className={`bg-white rounded-lg shadow overflow-hidden ${isDarkMode ? 'bg-gray-800' : ''}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Day
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Problem
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Difficulty
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {filteredProblems.map((problem) => (
                <tr key={problem._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <div className={`text-sm text-gray-900 ${isDarkMode ? 'text-gray-200' : ''}`}>Day {problem.day}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <div className="flex items-center">
                      <div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {problem.title}
                        </div>
                        {problem.link && (
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            View Problem
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(problem.status)}`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <select
                      value={problem.status}
                      onChange={(e) => updateProblemStatus(problem._id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-200'
                          : 'bg-gray-100 text-gray-800'
                      } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="todo">Todo</option>
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

      {/* Toast Message */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          toastMessage.type === 'error'
            ? 'bg-red-500'
            : 'bg-green-500'
        } text-white`}>
          {toastMessage.text}
          <button
            className="ml-4 text-white hover:text-gray-200"
            onClick={() => setShowToast(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default DSATracker;
