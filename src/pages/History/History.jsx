// src/pages/History/History.jsx

import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import historyService from '../../services/historyService';
import SongCard from '../../components/SongCard/SongCard';
import styles from './History.module.css';

const History = () => {
    const [listeningHistory, setListeningHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playTrack } = useContext(PlayerContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const history = await historyService.getListeningHistory();
                setListeningHistory(history || []);
            } catch (err) {
                console.error('Error fetching listening history:', err);
                setError('Failed to load listening history. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Listening History</h2>
            {loading && <p className={styles.loading}>Loading listening history...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && listeningHistory.length === 0 && !error && (
                <p className={styles.emptyMessage}>Your listening history is empty.</p>
            )}
            <div className={styles.grid}>
                {Array.from(
                    new Map(
                        (Array.isArray(listeningHistory) ? listeningHistory : [])
                            .filter(song => song && typeof song === 'object' && song.id)
                            .map(song => [song.id, song])
                    ).values()
                ).map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </div>
    );
};

export default History;
