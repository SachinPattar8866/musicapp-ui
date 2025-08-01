// src/pages/Explore/Explore.jsx (Updated)

import React, { useEffect, useState, useContext } from 'react'; // Import useContext
import SongCard from '../../components/Songcard/SongCard';
import styles from './Explore.module.css';
import api from '../../services/api';
import { PlayerContext } from '../../context/PlayerContext'; // Import PlayerContext

const Explore = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playTrack } = useContext(PlayerContext); // Get playTrack from context

    useEffect(() => {
        const fetchPopular = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/music/popular');
                setSongs(res.data);
            } catch (err) {
                console.error('Error fetching popular songs:', err);
                setError('Failed to load songs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    return (
        <div className={styles.exploreRoot}>
            <h1 className={styles.header}>Explore</h1>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.grid}>
                {songs.map(song => (
                    <SongCard 
                        key={song.id} 
                        song={song} 
                        onClick={() => playTrack(song, songs)} // Pass the full songs array
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;