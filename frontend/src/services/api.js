import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://tourism-app1-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tours API
export const tourAPI = {
  getAll: (params) => api.get('/tours', { params }),
  getById: (id) => api.get(`/tours/${id}`),
  create: (data) => api.post('/tours', data),
  update: (id, data) => api.put(`/tours/${id}`, data),
  delete: (id) => api.delete(`/tours/${id}`),
  search: (keyword) => api.get(`/tours/search?keyword=${keyword}`),
};

// Bookings API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status, remarks) => api.patch(`/bookings/${id}/status`, { status, remarks }),
  getByEmail: (email) => api.get(`/bookings/email/${email}`),
  delete: (id) => api.delete(`/bookings/${id}`),
  checkAvailability: (tourId, date) => api.get('/bookings/check-availability', { params: { tourId, date } }),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  getAllUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  updatePassword: (id, newPassword) => api.patch(`/auth/users/${id}/password`, { newPassword }),
};

// Contact API
export const contactAPI = {
  create: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  reply: (id, replyMessage) => api.post(`/contact/${id}/reply`, { replyMessage }),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export default api;
