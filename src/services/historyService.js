import api from './api';

const historyService = {
    getListeningHistory: async () => {
        const response = await api.get('/history');
        return response.data;
    },

    addToHistory: async (track) => {
        const response = await api.post('/history', track);
        return response.data;
    },
};

export default historyService;
