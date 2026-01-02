import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const cowService = {
  getCows: () => api.get('/cows/').then(res => res.data),
  getCow: (id) => api.get(`/cows/${id}`).then(res => res.data),
  createCow: (cowData) => api.post('/cows/', cowData).then(res => res.data),
  deleteCow: (id) => api.delete(`/cows/${id}`).then(res => res.data),
  
  getAllEvents: () => api.get('/cows/events/all').then(res => res.data),
  getCowEvents: (cowId) => api.get(`/cows/${cowId}/events`).then(res => res.data),
  addCowEvent: (cowId, eventData) => api.post(`/cows/${cowId}/events`, eventData).then(res => res.data),
  updateCowEvent: (eventId, eventData) => api.patch(`/cows/events/${eventId}`, eventData).then(res => res.data),

  getSettings: () => api.get('/cows/settings').then(res => res.data),
  updateSettings: (settings) => api.post('/cows/settings', settings).then(res => res.data),
};

export default api;
