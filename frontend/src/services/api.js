// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies!
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available (fallback for header method)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    signup: (userData) => api.post('/signup', userData),
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getProfile: () => api.get('/profile'),
    getUsers: () => api.get('/users'),
    checkAuth: () => api.get('/check-auth')
};

export default api;