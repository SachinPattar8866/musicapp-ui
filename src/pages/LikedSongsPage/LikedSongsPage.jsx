// src/pages/LikedSongsPage/LikedSongsPage.jsx

import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import SongCard from '../../components/Songcard/SongCard';
import styles from './LikedSongsPage.module.css';

const LikedSongsPage = () => {
    // UPDATED: Get likedTracks and playTrack directly from the context
    const { likedTracks, playTrack } = useContext(PlayerContext);
    
    // UPDATED: Removed redundant state and useEffect hook

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Liked Songs</h2>
            {likedTracks.length === 0 && (
                <p className={styles.emptyText}>You haven't liked any songs yet.</p>
            )}
            <div className={styles.grid}>
                {likedTracks.map((song) => (
                    <SongCard 
                        key={song.id} 
                        song={song}
                        // ADDED: onClick handler
                        onClick={() => playTrack(song, likedTracks)}
                    />
                ))}
            </div>
        </div>
    );
};

export default LikedSongsPage;