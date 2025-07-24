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

    addToHistory: async (payload) => {
        try {
            // Verify payload has trackId
            if (!payload || !payload.trackId) {
                console.error("Invalid history payload:", payload);
                throw new Error("Invalid history payload");
            }
            const response = await api.post('/history', payload);
            return response.data;
        } catch (error) {
            console.error("Error adding to history:", error);
            // Re-throw for the caller to handle
            throw error;
        }
    },
};

export default historyService;
