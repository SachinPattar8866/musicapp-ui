// src/pages/Home/Home.jsx
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
    const { user } = useAuth(); // Get user from auth context
    const { likedTracks, playTrack } = useContext(PlayerContext); // Get liked tracks and playTrack from context

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular songs - limit to 8 (Always public)
                const songResults = await musicService.getPopularTracks();
                setSongs((songResults || []).slice(0, 8));

                // Only fetch liked songs if user is authenticated
                if (user) {
                    let liked = [];
                    try {
                        liked = await likeService.getLikedTracks();
                    } catch (e1) {
                        console.log('Error fetching from likeService (might be unauthenticated):', e1);
                        try {
                            liked = await musicService.getLikedSongs();
                        } catch (e2) {
                            console.log('Error fetching from musicService (might be unauthenticated):', e2);
                            liked = likedTracks || [];
                        }
                    }
                    setLikedSongs((liked || []).slice(0, 8));
                } else {
                    // User is not logged in, clear liked songs
                    setLikedSongs([]);
                }

                // Fetch user playlists ONLY if user is logged in - limit to 4
                if (user) {
                    const playlistResults = await playlistService.getUserPlaylists();
                    setPlaylists((playlistResults || []).slice(0, 4));
                } else {
                    // User is not logged in, clear playlists
                    setPlaylists([]);
                }

                // Fetch Listen Again (history) ONLY if user is authenticated
                if (user) { // <--- ADDED/CONFIRMED THIS CONDITIONAL CHECK
                    let listenHistory = [];
                    try {
                        listenHistory = await historyService.getListeningHistory();
                    } catch (e) {
                        console.error('Error fetching listening history (might be unauthenticated):', e);
                        listenHistory = [];
                    }
                    setHistory(listenHistory || []);
                } else {
                    // User is not logged in, clear history
                    setHistory([]);
                }

                // Placeholder: Albums For You (Always public if your backend allows)
                // If this also makes an authenticated call, it needs a similar `if (user)` block
                setAlbums([]); // TODO: Replace with real data if available
            } catch (err) {
                console.error('General error fetching data in Home:', err);
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
                .map(song => (
                <SongCard 
                    key={song.id} 
                    song={song} 
                    onClick={() => playTrack(song, songs)} 
                />
            ))}
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
                        <p className={styles.emptyMessage}>
                            {user ? "No liked songs found." : "Log in to see your liked songs."} {/* Updated message */}
                        </p>
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
                        <p className={styles.emptyMessage}>
                            {user ? "No recent listening history." : "Log in to see your listening history."} {/* Updated message */}
                        </p>
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
                        <p className={styles.emptyMessage}>
                            {user ? "No playlists found." : "Log in to see your playlists."} {/* Updated message */}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;