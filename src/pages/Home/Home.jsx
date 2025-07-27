import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import musicService from '../../services/musicService';
import playlistService from '../../services/playlistService';
import SongCard from '../../components/Songcard/SongCard';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import useAuth from '../../hooks/useAuth';
import historyService from '../../services/historyService';
import likeService from '../../services/likeService';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './Home.module.css';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [history, setHistory] = useState([]); // Recently played songs
    const [albums, setAlbums] = useState([]); // Placeholder for Albums For You
    const { user } = useAuth();
    const { likedTracks } = useContext(PlayerContext); // Get liked tracks from context

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular songs - limit to 8
                const songResults = await musicService.getPopularTracks();
                setSongs((songResults || []).slice(0, 8));

                // Only fetch liked songs if user is authenticated
                if (user) {
                    let liked = [];
                    try {
                        // Try from likeService first
                        liked = await likeService.getLikedTracks();
                    } catch (e1) {
                        console.log('Error fetching from likeService:', e1);
                        try {
                            // Fall back to musicService
                            liked = await musicService.getLikedSongs();
                        } catch (e2) {
                            console.log('Error fetching from musicService:', e2);
                            // Use context data as last resort
                            liked = likedTracks || [];
                        }
                    }
                    // Limit to 8 items
                    setLikedSongs((liked || []).slice(0, 8));
                } else {
                    setLikedSongs([]);
                }

                // Fetch user playlists ONLY if user is logged in - limit to 4
                if (user) {
                    const playlistResults = await playlistService.getUserPlaylists();
                    setPlaylists((playlistResults || []).slice(0, 4));
                } else {
                    setPlaylists([]);
                }

                // Fetch Listen Again (history) - limit to 8
                let listenHistory = [];
                try {
                    listenHistory = await historyService.getListeningHistory();
                } catch (e) {
                    listenHistory = [];
                }
                setHistory(listenHistory || []);

                // Placeholder: Albums For You
                setAlbums([]); // TODO: Replace with real data if available
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [user, likedTracks]); // Re-fetch when user or likedTracks change

    return (
        <div className={styles.container}>
            {/* Popular Songs */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popular Songs</h2>
                    <Link to="/explore" className={styles.viewAllLink}>
                        View All
                    </Link>
                </div>
                <div className={styles.gridContainer}>
                    {(songs || [])
                        .filter(song => song && typeof song === 'object' && song.id)
                        .map(song => <SongCard key={song.id} song={song} />)}
                </div>
            </div>

            {/* Your Favorites */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Your Favorites</h2>
                    {likedSongs.length > 0 && (
                        <Link to="/liked-songs" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.gridContainer}>
                    {(likedSongs || []).filter(song => song && typeof song === 'object' && song.id).length > 0 ? (
                        (likedSongs || [])
                            .filter(song => song && typeof song === 'object' && song.id)
                            .map(song => <SongCard key={song.id} song={song} />)
                    ) : (
                        <p className={styles.emptyMessage}>No liked songs found.</p>
                    )}
                </div>
            </div>

            {/* Listen Again (Recently Played) */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Listen Again</h2>
                    {(history || []).filter(song => song && typeof song === 'object' && song.id).length > 0 && (
                        <Link to="/history" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.gridContainer}>
                    {(history || []).filter(song => song && typeof song === 'object' && song.id).length > 0 ? (
                        Array.from(
                            new Map(
                                (history || [])
                                    .filter(song => song && typeof song === 'object' && song.id)
                                    .map(song => [song.id, song])
                            ).values()
                        ).map(song => <SongCard key={song.id} song={song} />)
                    ) : (
                        <p className={styles.emptyMessage}>No recent listening history.</p>
                    )}
                </div>
            </div>

            {/* Albums For You (Recommended/Popular Albums) */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Albums For You</h2>
                    {(albums || []).filter(album => album && typeof album === 'object' && album.id).length > 0 && (
                        <Link to="/explore" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.gridContainer}>
                    {(albums || []).filter(album => album && typeof album === 'object' && album.id).length > 0 ? (
                        (albums || [])
                            .filter(album => album && typeof album === 'object' && album.id)
                            .map(album => <PlaylistCard key={album.id} playlist={album} />)
                    ) : (
                        <p className={styles.emptyMessage}>No album recommendations yet.</p>
                    )}
                </div>
            </div>

            {/* Your Playlists */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Your Playlists</h2>
                    {(playlists || []).filter(playlist => playlist && typeof playlist === 'object' && playlist.id).length > 0 && (
                        <Link to="/library" className={styles.viewAllLink}>
                            View All
                        </Link>
                    )}
                </div>
                <div className={styles.gridContainer}>
                    {(playlists || []).filter(playlist => playlist && typeof playlist === 'object' && playlist.id).length > 0 ? (
                        (playlists || [])
                            .filter(playlist => playlist && typeof playlist === 'object' && playlist.id)
                            .map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)
                    ) : (
                        <p className={styles.emptyMessage}>No playlists found. Log in to see your playlists.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;