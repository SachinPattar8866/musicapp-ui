// src/services/musicService.js

import api from './api';

const musicService = {
    /**
     * Searches for tracks based on a query.
     * Maps to: GET /api/music/search?q={query}
     * @param {string} query The search term.
     * @returns {Promise<Array>} A promise that resolves to an array of song objects.
     */
    searchTracks: async (query) => {
        try {
            // Encode the query to handle special characters in the URL
            const response = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching tracks:', error);
            // Re-throw the error so the calling component can handle it
            throw error;
        }
    },

    /**
     * Fetches a list of popular tracks.
     * Maps to: GET /api/music/popular
     * @returns {Promise<Array>} A promise that resolves to an array of popular song objects.
     */
    getPopularTracks: async () => {
        try {
            const response = await api.get('/music/popular');
            return response.data;
        } catch (error) {
            console.error('Error fetching popular tracks:', error);
            throw error;
        }
    },

    /**
     * Fetches detailed information for a specific track.
     * Maps to: GET /api/music/details/{trackId}
     * @param {string} trackId The ID of the track.
     * @returns {Promise<Object>} A promise that resolves to a detailed song object.
     */
    getTrackDetails: async (trackId) => {
        try {
            const response = await api.get(`/music/details/${trackId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching track details for ID ${trackId}:`, error);
            throw error;
        }
    },

    /**
     * Fetches all liked songs for the current user.
     * Maps to: GET /api/user/liked-songs (or similar)
     * @returns {Promise<Array>} A promise that resolves to an array of liked song objects.
     */
    getLikedSongs: async () => {
        try {
            // Adjust the endpoint to match your Spring Boot backend's liked songs API
            const response = await api.get('/user/liked-songs'); // Assuming /api/user/liked-songs
            return response.data;
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            throw error;
        }
    },

    /**
     * Fetches all playlists created by the current user.
     * Maps to: GET /api/playlists/user (or similar)
     * @returns {Promise<Array>} A promise that resolves to an array of playlist objects.
     */
    getUserPlaylists: async () => {
        try {
            // Adjust the endpoint to match your Spring Boot backend's user playlists API
            const response = await api.get('/playlists/user'); // Assuming /api/playlists/user
            return response.data;
        } catch (error) {
            console.error('Error fetching user playlists:', error);
            throw error;
        }
    },

    /**
     * Fetches detailed information for a specific playlist.
     * Maps to: GET /api/playlists/{playlistId}
     * @param {string} playlistId The ID of the playlist.
     * @returns {Promise<Object>} A promise that resolves to a detailed playlist object including its songs.
     */
    getPlaylistById: async (playlistId) => {
        try {
            // Adjust this endpoint to match your Spring Boot backend's get playlist by ID API
            const response = await api.get(`/playlists/${playlistId}`); // Assuming /api/playlists/{id}
            return response.data;
        } catch (error) {
            console.error(`Error fetching playlist details for ID ${playlistId}:`, error);
            throw error;
        }
    },

    // You can add more functions here as needed, e.g.,
    // addSongToLiked: async (songId) => { ... },
    // createPlaylist: async (playlistData) => { ... },
    // addSongToPlaylist: async (playlistId, songId) => { ... },
};

export default musicService;