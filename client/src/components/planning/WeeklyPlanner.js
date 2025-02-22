import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, startOfWeek } from 'date-fns';

const goalCategories = [
  { value: 'DSA', label: 'DSA Problems' },
  { value: 'SYSTEM_DESIGN', label: 'System Design' },
  { value: 'PROJECT', label: 'Project Work' },
  { value: 'CONTENT', label: 'Content Creation' },
  { value: 'OTHER', label: 'Other' }
];

const WeeklyPlanner = () => {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    category: 'DSA',
    target: 0,
    notes: ''
  });

  useEffect(() => {
    fetchWeeklyPlan();
  }, [selectedWeek]);

  const fetchWeeklyPlan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/planning/weekly?weekStartDate=${format(selectedWeek, 'yyyy-MM-dd')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      
      if (data.success) {
        setWeeklyPlan(data.data);
      } else {
        setWeeklyPlan(null);
      }
    } catch (err) {
      console.error('Error fetching weekly plan:', err);
      setError('Failed to load weekly plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      category: 'DSA',
      target: 0,
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      category: goal.category,
      target: goal.target,
      notes: goal.notes || ''
    });
    setOpenDialog(true);
  };

  const handleSaveGoal = async () => {
    try {
      const goalData = {
        ...goalForm,
        completed: editingGoal?.completed || 0
      };

      const token = localStorage.getItem('token');
      const url = editingGoal 
        ? `http://localhost:5000/api/planning/weekly/${weeklyPlan._id}/goal/${editingGoal._id}`
        : `http://localhost:5000/api/planning/weekly/${weeklyPlan._id}/goal`;

      const response = await axios({
        method: editingGoal ? 'PUT' : 'POST',
        url,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(goalData)
      });

      const data = response.data;
      if (data.success) {
        fetchWeeklyPlan();
        setOpenDialog(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error saving goal:', err);
      setError('Failed to save goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/planning/weekly/${weeklyPlan._id}/goal/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (data.success) {
        fetchWeeklyPlan();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  const calculateProgress = (completed, target) => {
    return (completed / target) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-3">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Selection */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={format(selectedWeek, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedWeek(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 52 }, (_, i) => (
              <option key={i + 1} value={format(addDays(startOfWeek(new Date()), i * 7), 'yyyy-MM-dd')}>Week {i + 1}</option>
            ))}
          </select>
        </div>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddGoal}
        >
          Add Weekly Goal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {weeklyPlan?.goals.map((goal) => (
          <div
            key={goal._id}
            className={`p-4 border rounded-lg ${goal.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => handleEditGoal(goal)}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <div>
                  <h3 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {goalCategories.find(cat => cat.value === goal.category)?.label}
                  </h3>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>Target: {goal.target}</span>
                    {goal.notes && (
                      <>
                        <span>•</span>
                        <span>{goal.notes}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="bg-blue-500 text-xs font-bold text-white text-center p-0.5 leading-none rounded-l-full"
                        style={{ width: `${calculateProgress(goal.completed, goal.target)}%` }}
                      >
                        {goal.completed} / {goal.target}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleEditGoal(goal)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {weeklyPlan?.reflection && (
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="font-medium text-gray-900">Weekly Reflection</h3>
          <div className="mt-2">
            <h4 className="font-medium text-gray-900">Achievements</h4>
            <ul className="list-disc pl-4">
              {weeklyPlan.reflection.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <h4 className="font-medium text-gray-900">Challenges</h4>
            <ul className="list-disc pl-4">
              {weeklyPlan.reflection.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <h4 className="font-medium text-gray-900">Areas for Improvement</h4>
            <ul className="list-disc pl-4">
              {weeklyPlan.reflection.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add/Edit Goal Dialog */}
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${openDialog ? 'block' : 'hidden'}`}
        aria-labelledby="modal-headline"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    {editingGoal ? 'Edit Weekly Goal' : 'Add Weekly Goal'}
                  </h3>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={goalForm.category}
                        onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {goalCategories.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Target"
                        value={goalForm.target}
                        onChange={(e) => setGoalForm({ ...goalForm, target: parseInt(e.target.value) || 0 })}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Notes"
                        value={goalForm.notes}
                        onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSaveGoal}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
