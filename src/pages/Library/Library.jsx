import React, { useEffect, useState } from 'react';
import musicService from '../../services/musicService';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import SongCard from '../../components/SongCard/SongCard';
import styles from './Library.module.css';

const Library = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        fetchLikedSongs();
        fetchUserPlaylists();
    }, []);

    const fetchLikedSongs = async () => {
        try {
            const songs = await musicService.getLikedSongs();
            setLikedSongs(songs || []);
        } catch (error) {
            console.error('Failed to fetch liked songs:', error);
        }
    };

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
                <h3 className={styles.subTitle}>Liked Songs</h3>
                <div className={styles.grid}>
                    {likedSongs.length > 0 ? (
                        likedSongs.map((song) => <SongCard key={song.id} song={song} />)
                    ) : (
                        <p className={styles.emptyText}>You haven't liked any songs yet.</p>
                    )}
                </div>
            </div>

            <div className={styles.subsection}>
                <h3 className={styles.subTitle}>Playlists</h3>
                <div className={styles.grid}>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
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
