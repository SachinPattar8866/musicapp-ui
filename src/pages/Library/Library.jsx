// src/pages/Library/Library.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import musicService from '../../services/musicService';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import SongCard from '../../components/Songcard/SongCard';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './Library.module.css';

const Library = () => {
    // UPDATED: Using likedTracks and playTrack directly from context
    const { likedTracks, playTrack } = useContext(PlayerContext);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true); // Still need this for playlists
    
    // UPDATED: Removed fetchLikedSongs since context handles it
    useEffect(() => {
        fetchUserPlaylists();
        setLoading(false); // Set loading to false once playlists are handled
    }, []);

    const fetchUserPlaylists = async () => {
        try {
            const userPlaylists = await musicService.getUserPlaylists();
            setPlaylists(userPlaylists || []);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Your Library</h2>

            <div className={styles.subsection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.subTitle}>Recently Liked</h3>
                    {likedTracks.length > 0 && (
                        <Link to="/liked-songs" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.grid}>
                    {likedTracks.length > 0 ? (
                        likedTracks
                            .filter((song) => song && typeof song === 'object' && song.id)
                            .slice(0, 8)
                            .map((song) => (
                                <SongCard 
                                    key={song.id} 
                                    song={song} 
                                    // ADDED: onClick handler
                                    onClick={() => playTrack(song, likedTracks)}
                                />
                            ))
                    ) : (
                        <p className={styles.emptyText}>You haven't liked any songs yet.</p>
                    )}
                </div>
            </div>

            <div className={styles.subsection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.subTitle}>Playlists</h3>
                    {playlists.length > 0 && (
                        <Link to="/playlists" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.grid}>
                    <Link to="/liked-songs" className={styles.likedSongsCard}>
                        <div className={styles.likedSongsGradient}>
                            <div className={styles.likedSongsContent}>
                                <h4 className={styles.likedSongsTitle}>Liked Songs</h4>
                                <p className={styles.likedSongsCount}>
                                    {likedTracks.length} songs
                                </p>
                            </div>
                        </div>
                    </Link>

                    {playlists.length > 0 ? (
                        playlists
                            .filter((playlist) => playlist && typeof playlist === 'object' && playlist.id)
                            .map((playlist) => (
                                <PlaylistCard key={playlist.id} playlist={playlist} />
                            ))
                    ) : (
                        <p className={styles.emptyText}>No playlists found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;