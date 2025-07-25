import React, { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './SongCard.module.css';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

// Import the default thumbnail image
const defaultThumbnail = new URL('../../assets/default-thumbnail.jpg', import.meta.url).href;

const SongCard = ({ song }) => {
    const { playTrack, isTrackLiked, addToLikedTracks, removeFromLikedTracks } = useContext(PlayerContext);
    const [imageError, setImageError] = useState(false);
    const { isAuthenticated } = useAuth();
    const isLiked = isTrackLiked(song.id);

    const handlePlay = () => {
        playTrack(song);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleToggleLike = async (e) => {
        e.stopPropagation(); // Prevent card click event (play)
        
        if (!isAuthenticated) {
            alert('Please login to like songs');
            return;
        }
        
        try {
            if (isLiked) {
                await removeFromLikedTracks(song.id);
            } else {
                await addToLikedTracks(song);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Use the image URL directly if it's a complete URL, otherwise use the default thumbnail
    const imageUrl = imageError ? defaultThumbnail : (
        song.coverImage?.startsWith('http')
            ? song.coverImage
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
                <button 
                    className={styles.likeButton}
                    onClick={handleToggleLike}
                    title={isLiked ? 'Unlike' : 'Like'}
                >
                    {isLiked ? 
                        <FaHeart className={styles.heartIconFilled} /> : 
                        <FiHeart className={styles.heartIcon} />
                    }
                </button>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{song.name}</h3>
                <p className={styles.artist}>{song.artistName}</p>
            </div>
        </div>
    );
};

export default SongCard;