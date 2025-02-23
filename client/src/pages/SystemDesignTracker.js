  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const SystemDesignTracker = () => {
  const { isDarkMode } = useTheme();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedSection, setSelectedSection] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/system-design', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedSections = Array.isArray(response.data) ? response.data : [response.data];
      setSections(fetchedSections);

      console.log('fetchedSections', fetchedSections);
      
      // Calculate stats
      const newStats = {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0
      };
      
      fetchedSections.forEach(section => {
        section.topics.forEach(topic => {
          newStats.total++;
          switch(topic.status) {
            case 'completed':
              newStats.completed++;
              break;
            case 'in-progress':
              newStats.inProgress++;
              break;
            default:
              newStats.todo++;
          }
        });
      });
      
      setStats(newStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system design topics:', error.response || error);
      setError(error.response?.data?.message || 'Error fetching system design topics');
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/system-design/status', 
        { topicId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTopics(); // Refresh data after update
    } catch (error) {
      console.error('Error updating topic status:', error);
      setError('Error updating topic status');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-yellow-500 text-white';
      case 'todo':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getFilteredTopics = () => {
    let filtered = [];
    
    // First, get all topics or topics from selected section
    if (selectedSection) {
      const section = sections.find(s => s.section === selectedSection);
      filtered = section ? [...section.topics] : [];
    } else {
      filtered = sections.reduce((acc, section) => [...acc, ...section.topics], []);
    }

    // Then filter by status if needed
    if (filter !== 'all') {
      filtered = filtered.filter(topic => topic.status === filter);
    }

    return filtered;
  };

  const filteredTopics = getFilteredTopics();

  if (loading) return (
    <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FaSpinner className={`animate-spin text-4xl ${isDarkMode ? 'text-gray-200' : 'text-blue-500'}`} />
    </div>
  );

  if (error) return (
    <div className={`text-red-500 text-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      Error: {error}
    </div>
  );

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`bg-gray-100 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-sm md:text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Topics</h3>
          <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`bg-green-100 p-4 rounded-lg ${isDarkMode ? 'bg-green-800' : 'bg-green-100'}`}>
          <h3 className={`text-sm md:text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Completed</h3>
          <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stats.completed}</p>
        </div>
        <div className={`bg-yellow-100 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-800' : 'bg-yellow-100'}`}>
          <h3 className={`text-sm md:text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>In Progress</h3>
          <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stats.inProgress}</p>
        </div>
        <div className={`bg-gray-200 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <h3 className={`text-sm md:text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>To Do</h3>
          <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stats.todo}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label className={`text-sm font-medium text-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="all">All Topics</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label className={`text-sm font-medium text-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Section:</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className={`w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Sections</option>
            {sections.map(section => (
              <option key={section._id} value={section.section}>
                {section.section} ({section.topics.length} topics)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics Table */}
      <div className={`-mx-4 sm:mx-0 sm:rounded-lg overflow-hidden shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Section</th>
                <th className={`hidden md:table-cell px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Difficulty</th>
                <th className={`hidden lg:table-cell px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Components</th>
                <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-4 sm:px-6 py-4 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    <div className="font-medium">{topic.title}</div>
                    <div className="sm:hidden mt-1 text-xs text-gray-500">
                      {topic.section} • {topic.difficulty}
                    </div>
                  </td>
                  <td className={`hidden sm:table-cell px-6 py-4 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                    {sections.find(s => s.topics.some(t => t.id === topic.id))?.section}
                  </td>
                  <td className={`hidden md:table-cell px-6 py-4 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                    {topic.difficulty}
                  </td>
                  <td className={`hidden lg:table-cell px-6 py-4 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                    <ul className="list-disc list-inside">
                      {topic.components?.map((component, index) => (
                        <li key={index}>{component}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <select
                      value={topic.status}
                      onChange={(e) => updateTopicStatus(topic.id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium ${getStatusColor(topic.status)}`}
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
    </div>
  );
};

export default SystemDesignTracker;
