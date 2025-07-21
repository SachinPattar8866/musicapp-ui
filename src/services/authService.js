// src/services/authService.js (UPDATED)
import api from './api';

const authService = {
    login: async ({ email, password }) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async ({ name, email, password }) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    getProfile: async () => {
        // CHANGE HERE: Call the correct backend endpoint
        const response = await api.get('/user/me');
        return response.data;
    },
};

export default authService;