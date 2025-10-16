import axios from 'axios';

// Base URL for API - Updated to port 3001
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs - Mounted at /api/auth
// ============================================

export const authAPI = {
  // POST /api/auth/send-magic-link
  sendMagicLink: (email) => api.post('/auth/send-magic-link', { email }),
  
  // GET /api/auth/verify/:token
  verifyMagicLink: (token) => api.get(`/auth/verify/${token}`),
  
  // GET /api/auth/me
  getCurrentUser: () => api.get('/auth/me'),
  
  // POST /api/auth/logout
  logout: () => api.post('/auth/logout'),
};

// ============================================
// STUDENT APIs - Mounted at /api/students
// ============================================

export const studentAPI = {
  // GET /api/students/profile
  getProfile: () => api.get('/students/profile'),
  
  // PUT /api/students/profile
  updateProfile: (data) => api.put('/students/profile', data),
  
  // POST /api/students/resume
  uploadResume: (formData) => {
    return api.post('/students/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============================================
// COMPANY APIs - Mounted at /api/applications
// ============================================

export const companyAPI = {
  // GET /api/applications/companies
  getAllCompanies: () => api.get('/applications/companies'),
  
  // GET /api/applications/companies/:id
  getCompanyById: (id) => api.get(`/applications/companies/${id}`),
};

// ============================================
// APPLICATION APIs (Pipeline) - Mounted at /api/applications
// ============================================

export const applicationAPI = {
  // GET /api/applications/my-applications - Get student's applications (personal pipeline)
  getMyApplications: () => api.get('/applications/my-applications'),
  
  // POST /api/applications/apply - Apply to a company
  applyToCompany: (companyId) => api.post('/applications/apply', { companyId }),
  
  // PUT /api/applications/applications/:id/stage - Update application stage
  updateApplicationStage: (applicationId, stageData) => 
    api.put(`/applications/applications/${applicationId}/stage`, stageData),
  
  // PUT /api/applications/applications/:id/withdraw - Withdraw application
  withdrawApplication: (applicationId) => 
    api.put(`/applications/applications/${applicationId}/withdraw`),
  
  // GET /api/applications/my-stats - Get application statistics
  getMyStats: () => api.get('/applications/my-stats'),
};

// ============================================
// RESOURCE APIs - Mounted at /api/resources
// ============================================

export const resourceAPI = {
  // GET /api/resources/company/:companyId - Get resources for a specific company
  getResourcesByCompany: (companyId) => api.get(`/resources/company/${companyId}`),
  
  // GET /api/resources/all - Get all approved resources
  getAllResources: () => api.get('/resources/all'),
  
  // POST /api/resources/contribute - Contribute a new resource
  contributeResource: (resourceData) => api.post('/resources/contribute', resourceData),
  
  // POST /api/resources/:id/download - Increment download count
  incrementDownload: (resourceId) => api.post(`/resources/${resourceId}/download`),
  
  // POST /api/resources/:id/view - Increment view count
  incrementView: (resourceId) => api.post(`/resources/${resourceId}/view`),
  
  // POST /api/resources/:id/rate - Rate a resource
  rateResource: (resourceId, rating) => api.post(`/resources/${resourceId}/rate`, { rating }),
  
  // GET /api/resources/my-contributions - Get user's contributed resources
  getMyContributions: () => api.get('/resources/my-contributions'),
};

// ============================================
// DISCUSSION APIs (Forum) - Mounted at /api/discussions
// ============================================

export const discussionAPI = {
  // GET /api/discussions/my-forums - Get all available forums for student
  getMyForums: () => api.get('/discussions/my-forums'),
  
  // GET /api/discussions/channel/:companyId/:channelName - Get messages for a specific channel
  getChannelMessages: (companyId, channelName, params = {}) => 
    api.get(`/discussions/channel/${companyId}/${channelName}`, { params }),
  
  // POST /api/discussions/send - Send a message
  sendMessage: (messageData) => api.post('/discussions/send', messageData),
  
  // PUT /api/discussions/:id - Edit a message
  editMessage: (messageId, message) => api.put(`/discussions/${messageId}`, { message }),
  
  // DELETE /api/discussions/:id - Delete a message
  deleteMessage: (messageId) => api.delete(`/discussions/${messageId}`),
  
  // POST /api/discussions/:id/react - React to a message
  reactToMessage: (messageId, emoji) => api.post(`/discussions/${messageId}/react`, { emoji }),
  
  // GET /api/discussions/channels/:companyId - Get all channels for a company
  getCompanyChannels: (companyId) => api.get(`/discussions/channels/${companyId}`),
};

// ============================================
// EVENT APIs (Calendar) - Mounted at /api/events
// ============================================

export const eventAPI = {
  // GET /api/events - Get all events (with optional filters)
  getAllEvents: (params = {}) => api.get('/events', { params }),
  
  // GET /api/events/my-events - Get student's relevant events
  getMyEvents: () => api.get('/events/my-events'),
  
  // POST /api/events/:companyId/:eventId/register - Register for an event
  registerForEvent: (companyId, eventId) => api.post(`/events/${companyId}/${eventId}/register`),
  
  // DELETE /api/events/:companyId/:eventId/register - Cancel event registration
  cancelRegistration: (companyId, eventId) => api.delete(`/events/${companyId}/${eventId}/register`),
  
  // PUT /api/events/:companyId/:eventId/attendance - Update event attendance status
  updateAttendance: (companyId, eventId, status) => api.put(`/events/${companyId}/${eventId}/attendance`, { status }),
  
  // GET /api/events/:companyId/:eventId - Get event details
  getEventById: (companyId, eventId) => api.get(`/events/${companyId}/${eventId}`),
};

// ============================================
// SUPPORT APIs (Tickets) - Mounted at /api/support
// ============================================

export const supportAPI = {
  // GET /api/support/my-tickets - Get all tickets for the authenticated student
  getMyTickets: () => api.get('/support/my-tickets'),
  
  // GET /api/support/tickets/:id - Get a specific ticket by ID
  getTicketById: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  
  // POST /api/support/create - Create a new support ticket
  createTicket: (ticketData) => api.post('/support/create', ticketData),
  
  // PATCH /api/support/tickets/:id/status - Update ticket status
  updateTicketStatus: (ticketId, status) => api.patch(`/support/tickets/${ticketId}/status`, { status }),
  
  // POST /api/support/tickets/:id/response - Add response to ticket
  addTicketResponse: (ticketId, message) => api.post(`/support/tickets/${ticketId}/response`, { message }),
  
  // GET /api/support/stats - Get ticket statistics
  getTicketStats: () => api.get('/support/stats'),
  
  // DELETE /api/support/tickets/:id - Delete a ticket (only pending)
  deleteTicket: (ticketId) => api.delete(`/support/tickets/${ticketId}`),
};

export default api;

