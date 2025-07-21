// src/services/playlistService.js (UPDATED)
import api from './api';

const playlistService = {
    // ... other methods

    // CHANGE: Accept userId as a parameter
    getUserPlaylists: async (userId) => {
        if (!userId) {
            // Optional: Handle case where userId is not provided (e.g., throw an error or return empty)
            console.error("User ID is required to fetch playlists.");
            return [];
        }
        // CHANGE: Include the userId in the URL path
        const response = await api.get(`/playlists/user/${userId}`);
        return response.data;
    },

    // ... create, update, delete playlist methods if they exist here
};

export default playlistService;