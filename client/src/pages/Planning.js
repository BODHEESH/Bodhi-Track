import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import DailyPlanner from '../components/planning/DailyPlanner';
import WeeklyPlanner from '../components/planning/WeeklyPlanner';
import ProgressAnalytics from '../components/analytics/ProgressAnalytics';
import Reminders from '../components/reminders/Reminders';

const Planning = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className={`min-h-screen bg-${isDarkMode ? 'gray-900' : 'gray-50'} p-6`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-${isDarkMode ? 'gray-200' : 'gray-900'} mb-2`}>Study Planning</h1>
        <p className={`text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>Plan and track your daily and weekly learning goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'daily'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('daily')}
              >
                Daily Plan
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'weekly'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('weekly')}
              >
                Weekly Plan
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'daily' && <DailyPlanner />}
              {activeTab === 'weekly' && <WeeklyPlanner />}
              {activeTab === 'analytics' && <ProgressAnalytics />}
            </div>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="lg:col-span-1">
          <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-semibold mb-4 text-${isDarkMode ? 'gray-200' : 'gray-900'}`}>Reminders</h2>
            <Reminders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
