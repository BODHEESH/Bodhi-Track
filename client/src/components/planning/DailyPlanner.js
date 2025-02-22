import React, { useState } from 'react';

const DailyPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'DSA',
    priority: 'medium',
    timeEstimate: 30
  });

  const taskTypes = ['DSA', 'System Design', 'Project', 'Content', 'Break'];
  const priorities = ['low', 'medium', 'high'];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({
      title: '',
      type: 'DSA',
      priority: 'medium',
      timeEstimate: 30
    });
  };

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Format date for display (e.g., "Thursday, February 21, 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="flex items-center space-x-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-600">
          {formatDate(selectedDate)}
        </span>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {taskTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Time estimate (minutes)"
            value={newTask.timeEstimate}
            onChange={(e) => setNewTask({ ...newTask, timeEstimate: parseInt(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`p-4 border rounded-lg ${
              task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskComplete(task.id)}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <div>
                  <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{task.type}</span>
                    <span>•</span>
                    <span className={`capitalize ${
                      task.priority === 'high' ? 'text-red-500' :
                      task.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span>•</span>
                    <span>{task.timeEstimate} mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyPlanner;
