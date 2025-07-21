// src/services/api.js
import axios from 'axios';
// Import getToken and removeToken from jwtUtils
import { getToken, removeToken } from '../utils/jwtUtils';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to requests
api.interceptors.request.use((config) => {
    // Use the getToken function from jwtUtils
    const token = getToken(); // Correctly retrieves from 'musicapp_token'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Global response handler (optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized globally (logout user, etc.)
            // Use the removeToken function from jwtUtils
            removeToken(); // Correctly removes 'musicapp_token'
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;