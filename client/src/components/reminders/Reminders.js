import React, { useState } from 'react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    type: 'DSA',
    time: '',
    daysOfWeek: ['1', '2', '3', '4', '5'], // Monday to Friday
    message: ''
  });

  const reminderTypes = ['DSA', 'System Design', 'Project', 'Content', 'Break'];
  const daysOfWeek = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' }
  ];

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminder.message || !newReminder.time) return;

    setReminders([...reminders, { ...newReminder, id: Date.now(), enabled: true }]);
    setNewReminder({
      type: 'DSA',
      time: '',
      daysOfWeek: ['1', '2', '3', '4', '5'],
      message: ''
    });
  };

  const handleDayToggle = (day) => {
    const currentDays = newReminder.daysOfWeek;
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setNewReminder({
      ...newReminder,
      daysOfWeek: updatedDays
    });
  };

  const handleToggleReminder = (reminderId) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const handleDeleteReminder = (reminderId) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  return (
    <div className="space-y-6">
      {/* Add Reminder Form */}
      <form onSubmit={handleAddReminder} className="space-y-4">
        <div className="space-y-4">
          <select
            value={newReminder.type}
            onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {reminderTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="time"
            value={newReminder.time}
            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Reminder message"
            value={newReminder.message}
            onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  newReminder.daysOfWeek.includes(day.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Reminder
        </button>
      </form>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map(reminder => (
          <div
            key={reminder.id}
            className={`p-4 border rounded-lg ${
              reminder.enabled ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${reminder.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                  {reminder.message}
                </h3>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{reminder.type}</span>
                  <span>•</span>
                  <span>{reminder.time}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {reminder.daysOfWeek.map(day => (
                    <span
                      key={day}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {daysOfWeek.find(d => d.value === day)?.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleReminder(reminder.id)}
                  className={`p-2 rounded-full ${
                    reminder.enabled
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {reminder.enabled ? 'On' : 'Off'}
                </button>
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="p-2 text-red-600 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
