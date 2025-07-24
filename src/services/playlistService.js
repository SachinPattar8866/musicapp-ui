// src/services/playlistService.js (UPDATED)
import api from './api';

const playlistService = {
    // ... other methods

    // Get playlists for the current authenticated user (no userId required)
    getUserPlaylists: async () => {
        const response = await api.get('/playlists/user');
        return response.data;
    },

    // ... create, update, delete playlist methods if they exist here
};

export default playlistService;