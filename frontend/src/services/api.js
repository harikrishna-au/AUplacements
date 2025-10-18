import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const attachClerkAuth = (getToken) => {
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
    return config;
  });
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadResume: (formData) => {
    return api.post('/students/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const companyAPI = {
  getAllCompanies: () => api.get('/applications/companies'),
  getCompanyById: (id) => api.get(`/applications/companies/${id}`),
};

export const applicationAPI = {
  getMyApplications: () => api.get('/applications/my-applications'),
  applyToCompany: (companyId) => api.post('/applications/apply', { companyId }),
  updateApplicationStage: (applicationId, stageData) => 
    api.put(`/applications/applications/${applicationId}/stage`, stageData),
  withdrawApplication: (applicationId) => 
    api.put(`/applications/applications/${applicationId}/withdraw`),
  getMyStats: () => api.get('/applications/my-stats'),
};

export const resourceAPI = {
  getResourcesByCompany: (companyId) => api.get(`/resources/company/${companyId}`),
  getAllResources: () => api.get('/resources/all'),
  contributeResource: (resourceData) => api.post('/resources/contribute', resourceData),
  incrementDownload: (resourceId) => api.post(`/resources/${resourceId}/download`),
  incrementView: (resourceId) => api.post(`/resources/${resourceId}/view`),
  rateResource: (resourceId, rating) => api.post(`/resources/${resourceId}/rate`, { rating }),
  getMyContributions: () => api.get('/resources/my-contributions'),
};

export const discussionAPI = {
  getMyForums: () => api.get('/discussions/my-forums'),
  getChannelMessages: (companyId, channelName, params = {}) => 
    api.get(`/discussions/channel/${companyId}/${channelName}`, { params }),
  sendMessage: (messageData) => api.post('/discussions/send', messageData),
  editMessage: (messageId, message) => api.put(`/discussions/${messageId}`, { message }),
  deleteMessage: (messageId) => api.delete(`/discussions/${messageId}`),
  reactToMessage: (messageId, emoji) => api.post(`/discussions/${messageId}/react`, { emoji }),
  getCompanyChannels: (companyId) => api.get(`/discussions/channels/${companyId}`),
};

export const eventAPI = {
  getAllEvents: (params = {}) => api.get('/events', { params }),
  getMyEvents: () => api.get('/events/my-events'),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  getEventById: (eventId) => api.get(`/events/${eventId}`),
};

export const supportAPI = {
  getMyTickets: () => api.get('/support/my-tickets'),
  getTicketById: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  createTicket: (ticketData) => api.post('/support/create', ticketData),
  updateTicketStatus: (ticketId, status) => api.patch(`/support/tickets/${ticketId}/status`, { status }),
  addTicketResponse: (ticketId, message) => api.post(`/support/tickets/${ticketId}/response`, { message }),
  getTicketStats: () => api.get('/support/stats'),
  deleteTicket: (ticketId) => api.delete(`/support/tickets/${ticketId}`),
};

export default api;
