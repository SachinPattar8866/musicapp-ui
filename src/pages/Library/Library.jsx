import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import musicService from '../../services/musicService';
import likeService from '../../services/likeService';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import SongCard from '../../components/Songcard/SongCard';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './Library.module.css';

const Library = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { likedTracks } = useContext(PlayerContext);

    useEffect(() => {
        fetchLikedSongs();
        fetchUserPlaylists();
    }, [likedTracks]); // Re-fetch when likedTracks changes in context

    const fetchLikedSongs = async () => {
        try {
            setLoading(true);
            // Try multiple sources for liked songs
            let songs;
            try {
                // First try likeService
                songs = await likeService.getLikedTracks();
            } catch (likeError) {
                console.log('Error with likeService, trying musicService:', likeError);
                try {
                    // Then try musicService
                    songs = await musicService.getLikedSongs();
                } catch (musicError) {
                    console.log('Error with musicService, using context:', musicError);
                    // Fall back to context data
                    songs = likedTracks || [];
                }
            }
            setLikedSongs(Array.isArray(songs) ? songs : []);
        } catch (error) {
            console.error('Failed to fetch liked songs:', error);
            setLikedSongs([]);
        } finally {
            setLoading(false);
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
                <div className={styles.sectionHeader}>
                    <h3 className={styles.subTitle}>Recently Liked</h3>
                    {likedSongs.length > 0 && (
                        <Link to="/liked-songs" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.grid}>
                    {loading ? (
                        <p className={styles.loadingText}>Loading liked songs...</p>
                    ) : likedSongs.length > 0 ? (
                        likedSongs
                            .filter((song) => song && typeof song === 'object' && song.id)
                            .slice(0, 8)
                            .map((song) => <SongCard key={song.id} song={song} />)
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
                    {/* Special Liked Songs Card */}
                    <Link to="/liked-songs" className={styles.likedSongsCard}>
                        <div className={styles.likedSongsGradient}>
                            <div className={styles.likedSongsContent}>
                                <h4 className={styles.likedSongsTitle}>Liked Songs</h4>
                                <p className={styles.likedSongsCount}>
                                    {likedSongs.length} songs
                                </p>
                            </div>
                        </div>
                    </Link>

                    {loading ? (
                        <p className={styles.loadingText}>Loading playlists...</p>
                    ) : playlists.length > 0 ? (
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
