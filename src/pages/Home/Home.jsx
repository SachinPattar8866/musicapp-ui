// src/pages/Home/Home.jsx (UPDATED)
import React, { useEffect, useState } from 'react';
import musicService from '../../services/musicService';
import playlistService from '../../services/playlistService';
import SongCard from '../../components/SongCard/SongCard';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import useAuth from '../../hooks/useAuth'; // <-- IMPORT useAuth hook
import styles from './Home.module.css';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const { user } = useAuth(); // <-- GET THE USER FROM AUTH CONTEXT

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular songs (assuming this part is working after previous fixes)
                const songResults = await musicService.getPopularTracks();
                setSongs(songResults || []);

                // Fetch user playlists ONLY if user is logged in
                if (user && user.id) { // <-- CHECK IF USER AND USER ID EXIST
                    const playlistResults = await playlistService.getUserPlaylists(user.id); // <-- PASS USER ID
                    setPlaylists(playlistResults || []);
                } else {
                    setPlaylists([]); // Clear playlists if no user is logged in
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
        // Add 'user' to the dependency array so fetchData runs again if user changes (e.g., logs in/out)
    }, [user]); // <-- ADD USER TO DEPENDENCY ARRAY

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Popular Songs</h2>
                <div className={styles.gridContainer}>
                    {songs.map((song) => (
                        <SongCard key={song.id} song={song} />
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Playlists</h2>
                <div className={styles.gridContainer}>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))
                    ) : (
                        <p className={styles.emptyMessage}>No playlists found. Log in to see your playlists.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;