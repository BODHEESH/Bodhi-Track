import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - will be replaced with backend data
  const profile = {
    name: 'John Doe',
    email: 'john@example.com',
    target: {
      role: 'Senior Software Engineer',
      company: 'Top Tech Company',
      targetSalary: '35+ LPA',
      deadline: '2025-08-19'
    },
    stats: {
      daysActive: 45,
      totalProblems: 150,
      projectsCompleted: 3,
      contentCreated: 8
    },
    streaks: {
      current: 7,
      longest: 15,
      thisWeek: 5
    },
    achievements: [
      {
        id: 1,
        title: '50 DSA Problems',
        description: 'Solved 50 DSA problems',
        progress: 75,
        icon: '🎯'
      },
      {
        id: 2,
        title: 'System Design Master',
        description: 'Complete 10 system design topics',
        progress: 40,
        icon: '🏗️'
      },
      {
        id: 3,
        title: 'Content Creator',
        description: 'Create 5 technical content pieces',
        progress: 60,
        icon: '📝'
      }
    ],
    settings: {
      darkMode: true,
      emailNotifications: true,
      dailyReminders: true
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {['overview', 'achievements', 'settings'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Target Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Target</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-800 dark:text-white">{profile.target.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-800 dark:text-white">{profile.target.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target Salary</p>
                  <p className="font-medium text-gray-800 dark:text-white">{profile.target.targetSalary}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium text-gray-800 dark:text-white">{profile.target.deadline}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">{profile.stats.daysActive}</p>
                <p className="text-sm text-gray-500">Days Active</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">{profile.stats.totalProblems}</p>
                <p className="text-sm text-gray-500">Problems Solved</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">{profile.stats.projectsCompleted}</p>
                <p className="text-sm text-gray-500">Projects Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">{profile.stats.contentCreated}</p>
                <p className="text-sm text-gray-500">Content Created</p>
              </div>
            </div>

            {/* Streaks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Streaks</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{profile.streaks.current}</p>
                  <p className="text-sm text-gray-500">Current Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{profile.streaks.longest}</p>
                  <p className="text-sm text-gray-500">Longest Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{profile.streaks.thisWeek}</p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {achievement.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {achievement.description}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Enable dark mode for better visibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.settings.darkMode}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive progress updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.settings.emailNotifications}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Daily Reminders</h3>
                  <p className="text-sm text-gray-500">Get reminded of your daily tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.settings.dailyReminders}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
