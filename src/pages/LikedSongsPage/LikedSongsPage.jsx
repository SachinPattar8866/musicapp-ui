// src/pages/LikedSongsPage/LikedSongsPage.jsx

import React, { useState, useEffect } from 'react';
import musicService from '../../services/musicService'; // Assuming this path
import SongCard from '../../components/SongCard/SongCard'; // Assuming this path
import styles from './LikedSongsPage.module.css'; // Create this CSS module if needed

const LikedSongsPage = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                setLoading(true);
                const songs = await musicService.getLikedSongs(); // Call your service
                setLikedSongs(songs || []);
            } catch (err) {
                console.error('Error fetching liked songs:', err);
                setError('Failed to load liked songs. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchLikedSongs();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="px-4 py-6">
            <h2 className="text-white text-2xl mb-4">Liked Songs</h2>
            {loading && <p className="text-gray-400">Loading liked songs...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && likedSongs.length === 0 && !error && (
                <p className="text-gray-400">You haven't liked any songs yet.</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {likedSongs.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </div>
    );
};

export default LikedSongsPage;