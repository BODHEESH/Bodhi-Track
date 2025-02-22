import React, { useState } from 'react';

const Review = () => {
  const [reviewPeriod, setReviewPeriod] = useState('weekly');

  // Sample data - will be replaced with backend data
  const weeklyData = {
    dsaProgress: {
      problemsSolved: 14,
      targetProblems: 20,
      byDifficulty: {
        easy: 5,
        medium: 7,
        hard: 2
      },
      topics: [
        { name: 'Arrays', count: 4 },
        { name: 'Trees', count: 3 },
        { name: 'DP', count: 2 }
      ]
    },
    systemDesign: {
      topicsCovered: 3,
      targetTopics: 4,
      topics: ['URL Shortener', 'Rate Limiter', 'Chat System']
    },
    projects: {
      completed: 1,
      inProgress: 2,
      commits: 24,
      hoursSpent: 15
    },
    content: {
      videos: 2,
      blogs: 1,
      views: 2500,
      engagement: '12%'
    },
    goals: [
      { id: 1, text: 'Complete System Design basics', achieved: true },
      { id: 2, text: 'Solve 20 DSA problems', achieved: false },
      { id: 3, text: 'Publish 2 blog posts', achieved: false }
    ],
    nextWeekPlan: [
      'Focus on Graph algorithms',
      'Complete Distributed Systems design',
      'Start new React Native project'
    ]
  };

  const monthlyData = {
    // Similar structure to weeklyData but with monthly stats
  };

  const data = reviewPeriod === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Progress Review</h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              reviewPeriod === 'weekly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setReviewPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reviewPeriod === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setReviewPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DSA Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">DSA Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Problems Solved</span>
                <span>{data.dsaProgress.problemsSolved}/{data.dsaProgress.targetProblems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(data.dsaProgress.problemsSolved / data.dsaProgress.targetProblems) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Difficulty</h3>
              <div className="flex space-x-4">
                {Object.entries(data.dsaProgress.byDifficulty).map(([difficulty, count]) => (
                  <div key={difficulty} className="text-center">
                    <div className="text-lg font-semibold text-indigo-600">{count}</div>
                    <div className="text-xs text-gray-500 capitalize">{difficulty}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Design Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">System Design</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Topics Covered</span>
                <span>{data.systemDesign.topicsCovered}/{data.systemDesign.targetTopics}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(data.systemDesign.topicsCovered / data.systemDesign.targetTopics) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Completed Topics</h3>
              <div className="space-y-1">
                {data.systemDesign.topics.map((topic, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    • {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.projects.commits}</div>
              <div className="text-sm text-gray-500">Commits</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.projects.hoursSpent}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
          </div>
        </div>

        {/* Content Creation Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Content Creation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.content.views}</div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.content.engagement}</div>
              <div className="text-sm text-gray-500">Engagement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Next Week Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Goals</h2>
          <div className="space-y-3">
            {data.goals.map((goal) => (
              <div key={goal.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={goal.achieved}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  readOnly
                />
                <span className={`ml-3 text-sm ${
                  goal.achieved
                    ? 'text-gray-500 line-through'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Next Week Plan</h2>
          <div className="space-y-2">
            {data.nextWeekPlan.map((plan, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                • {plan}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
