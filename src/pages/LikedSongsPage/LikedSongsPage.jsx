// src/pages/LikedSongsPage/LikedSongsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import likeService from '../../services/likeService';
import musicService from '../../services/musicService';
import SongCard from '../../components/Songcard/SongCard';
import styles from './LikedSongsPage.module.css';

const LikedSongsPage = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get liked tracks from PlayerContext
    const { likedTracks, playTrack } = useContext(PlayerContext);
    
    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                setLoading(true);
                // Try both methods to fetch liked songs
                let songs;
                try {
                    // First try likeService
                    songs = await likeService.getLikedTracks();
                } catch (likeError) {
                    console.log('Error with likeService, trying musicService:', likeError);
                    // If that fails, try musicService
                    songs = await musicService.getLikedSongs();
                }
                
                console.log('Fetched liked songs:', songs);
                setLikedSongs(Array.isArray(songs) ? songs : []);
            } catch (err) {
                console.error('Error fetching liked songs:', err);
                setError('Failed to load liked songs. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchLikedSongs();
    }, [likedTracks]); // Re-fetch when likedTracks changes

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Liked Songs</h2>
            {loading && <p className={styles.loading}>Loading liked songs...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && likedSongs.length === 0 && !error && (
                <p className={styles.emptyText}>You haven't liked any songs yet.</p>
            )}
            <div className={styles.grid}>
                {likedSongs.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </div>
    );
};

export default LikedSongsPage;