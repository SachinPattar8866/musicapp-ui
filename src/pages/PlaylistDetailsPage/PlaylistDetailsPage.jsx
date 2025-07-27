// src/pages/PlaylistDetailsPage/PlaylistDetailsPage.jsx (New File)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import musicService from '../../services/musicService';
import SongCard from '../../components/Songcard/SongCard';
import styles from './PlaylistDetailsPage.module.css'; // IMPORTANT: Update CSS import path

const PlaylistDetailsPage = () => {
    const { id } = useParams(); // playlist ID from route param
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state for better UX

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                // Ensure musicService.getPlaylistById(id) exists and works with your backend
                const data = await musicService.getPlaylistById(id);
                setPlaylist(data);
            } catch (err) {
                console.error('Failed to fetch playlist:', err);
                setError('Failed to load playlist. Please try again or check the URL.'); // User-friendly error
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylistDetails();
    }, [id]); // Depend on 'id' so it refetches if the playlist ID in the URL changes

    if (loading) {
        return <div className="text-white p-4">Loading playlist...</div>;
    }

    if (error) { // Display error message
        return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!playlist) {
        return <div className="text-white p-4">Playlist not found.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src={playlist.thumbnail || '/default-thumbnail.jpg'} // Make sure 'thumbnail' or 'coverImage' matches your backend DTO
                    alt={playlist.name}
                    className={styles.thumbnail}
                />
                <div>
                    <h2 className={styles.title}>{playlist.name}</h2>
                    <p className={styles.description}>{playlist.description}</p>
                </div>
            </div>

            <div className={styles.songsGrid}>
                {playlist.songs && playlist.songs.length > 0 ? ( // Added check for playlist.songs existence
                    playlist.songs.map((song) => <SongCard key={song.id} song={song} />)
                ) : (
                    <p className={styles.emptyText}>No songs in this playlist.</p>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetailsPage;