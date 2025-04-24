import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your deployed backend URL when needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Automatically attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auth
export const register = (email) => api.post('/register', { email });
export const verifyOtp = (data) => api.post('/verify-otp', data);
export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/user/me');

// ✅ Profile
export const updateProfile = (data) => api.put('/user/update', data);
export const changePassword = (data) => api.put('/user/change-password', data);

// ✅ Dashboard
export const fetchDashboardData = () => api.get('/dashboard/data');

// ✅ Submission
export const submitSkinAnalysis = (formData) =>
  api.post('/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ✅ Consultation
export const getDoctors = () => api.get('/consultation/doctors');
export const scheduleConsultation = (data) => api.post('/consultation/book', data); // ✅ Correct one
export const getConsultationById = (id) => api.get(`/consultation/${id}`);

// ✅ Chat
export const fetchChatHistory = (consultationId) =>
  api.get(`/chat/history/${consultationId}`);

export default api;
