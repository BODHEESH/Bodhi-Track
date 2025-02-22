import React, { useState } from 'react';

const SystemDesign = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample data - will be replaced with backend data
  const topics = [
    {
      id: 1,
      title: 'URL Shortener (Bit.ly)',
      category: 'Basic',
      status: 'Completed',
      notes: 'Implemented with hash function and database',
      resources: [
        { type: 'Video', url: 'https://youtube.com/example1' },
        { type: 'Blog', url: 'https://example.com/blog1' }
      ],
      lastStudied: '2025-02-19',
      confidence: 4
    },
    // Add more sample topics
  ];

  const categories = [
    'All',
    'Basic',
    'Intermediate',
    'Advanced',
    'HLD',
    'LLD'
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || topic.category.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 5:
        return 'text-green-600';
      case 4:
        return 'text-blue-600';
      case 3:
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Design</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add Topic
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search topics..."
          className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilter === category.toLowerCase()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveFilter(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {topic.title}
              </h3>
              <span className={`font-bold ${getConfidenceColor(topic.confidence)}`}>
                {topic.confidence}/5
              </span>
            </div>
            
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {topic.category}
              </span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                topic.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {topic.status}
              </span>
            </div>

            {topic.notes && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {topic.notes}
              </p>
            )}

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Resources:</h4>
              <div className="mt-1 space-y-1">
                {topic.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    {resource.type}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Last studied: {topic.lastStudied}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemDesign;
