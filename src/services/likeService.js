import api from './api';

const likeService = {
    getLikedTracks: async () => {
        const response = await api.get('/likes');
        return response.data;
    },

    likeTrack: async (trackId) => {
        const response = await api.post('/likes', { trackId });
        return response.data;
    },

    unlikeTrack: async (trackId) => {
        const response = await api.delete(`/likes/${trackId}`);
        return response.data;
    },
};

export default likeService;
