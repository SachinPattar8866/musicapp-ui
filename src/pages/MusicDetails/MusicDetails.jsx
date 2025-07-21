import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import musicService from '../../services/musicService';
import styles from './MusicDetails.module.css';
import usePlayer from '../../hooks/usePlayer';

const MusicDetails = () => {
    const { id } = useParams(); // song ID
    const [music, setMusic] = useState(null);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();

    useEffect(() => {
        fetchMusicDetails();
    }, []);

    const fetchMusicDetails = async () => {
        try {
            const data = await musicService.getMusicById(id);
            setMusic(data);
        } catch (err) {
            console.error('Failed to fetch music:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white p-4">Loading music...</div>;
    }

    if (!music) {
        return <div className="text-white p-4">Music not found.</div>;
    }

    return (
        <div className={styles.container}>
            <img
                src={music.thumbnail || '/default-thumbnail.jpg'}
                alt={music.name}
                className={styles.thumbnail}
            />
            <div className={styles.details}>
                <h2 className={styles.title}>{music.name}</h2>
                <p className={styles.artist}>By {music.artist}</p>
                <p className={styles.album}>Album: {music.album}</p>
                <p className={styles.duration}>Duration: {music.duration}</p>
                <button className={styles.playButton} onClick={() => playTrack(music)}>
                    ▶ Play
                </button>
            </div>
        </div>
    );
};

export default MusicDetails;
