import React, { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './SongCard.module.css';
// Import the default thumbnail image
const defaultThumbnail = new URL('../../assets/default-thumbnail.jpg', import.meta.url).href;

const SongCard = ({ song }) => {
    const { playTrack } = useContext(PlayerContext);
    const [imageError, setImageError] = useState(false);

    const handlePlay = () => {
        playTrack(song);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Use the image URL directly if it's a complete URL, otherwise prepend the API base URL
    const imageUrl = imageError ? defaultThumbnail : (
        song.coverImage?.startsWith('http') 
            ? song.coverImage 
            : song.coverImage 
                ? `${import.meta.env.VITE_API_BASE_URL}/images/${song.coverImage}`
                : defaultThumbnail
    );

    return (
        <div className={styles.card} onClick={handlePlay}>
            <div className={styles.imageContainer}>
                <img
                    src={imageUrl}
                    alt={song.name}
                    onError={handleImageError}
                    className={styles.image}
                />
                <div className={styles.playOverlay}>
                    <button className={styles.playButton}>
                        <svg viewBox="0 0 24 24" className={styles.playIcon}>
                            <path fill="currentColor" d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{song.name}</h3>
                <p className={styles.artist}>{song.artistName}</p>
            </div>
        </div>
    );
};

export default SongCard;