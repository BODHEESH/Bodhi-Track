import api from './api';

const systemDesignService = {
  // Get all topics
  getAllTopics: async () => {
    const response = await api.get('/api/system-design');
    return response.data;
  },

  // Get topics by section
  getTopicsBySection: async (section) => {
    const response = await api.get(`/api/system-design/section/${section}`);
    return response.data;
  },

  // Update topic status
  updateTopicStatus: async (section, topicId, status) => {
    const response = await api.put('/api/system-design/status', { section, topicId, status });
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/api/system-design/stats');
    return response.data;
  }
};

export default systemDesignService;
