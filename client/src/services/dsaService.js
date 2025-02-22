import api from './api';

const dsaService = {
  // Get all DSA problems
  getAllProblems: async () => {
    const response = await api.get('/api/dsa');
    return response.data;
  },

  // Get problems by day
  getProblemsByDay: async (day) => {
    const response = await api.get(`/api/dsa/day/${day}`);
    return response.data;
  },

  // Update problem status
  updateProblemStatus: async (day, problemId, status) => {
    const response = await api.put('/api/dsa/status', { day, problemId, status });
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/api/dsa/stats');
    return response.data;
  }
};

export default dsaService;
