import api from './api';

const historyService = {
    getListeningHistory: async () => {
        try {
            const response = await api.get('/history');
            return response.data;
        } catch (error) {
            console.error("Error fetching listening history:", error);
            // Return empty array instead of throwing error
            return [];
        }
    },

    addToHistory: async (track) => {
        try {
            // Verify track has all required fields
            if (!track || !track.id) {
                console.error("Invalid track data:", track);
                throw new Error("Invalid track data");
            }
            
            const response = await api.post('/history', track);
            return response.data;
        } catch (error) {
            console.error("Error adding to history:", error);
            // Re-throw for the caller to handle
            throw error;
        }
    },
};

export default historyService;
