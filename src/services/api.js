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

// Attach token only for protected endpoints
api.interceptors.request.use((config) => {
    // List of public endpoints (add more as needed)
    const publicEndpoints = [
        '/songs',
        '/explore',
        '/search',
        '/music',
        '/playlists/public',
        // Add other public endpoints here
    ];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    const token = getToken();
    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Global response handler (optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect to login for protected endpoints
        const protectedEndpoints = [
            '/library',
            '/profile',
            '/liked-songs',
            '/history',
            '/playlists/private',
            // Add other protected endpoints here
        ];
        const url = error.config?.url || '';
        const isProtected = protectedEndpoints.some(endpoint => url.includes(endpoint));
        if (error.response?.status === 401 && isProtected) {
            removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;