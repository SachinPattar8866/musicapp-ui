import React, { useContext, useState, useRef, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import likeService from '../../services/likeService';
import useAuth from '../../hooks/useAuth';
import styles from './AudioPlayer.module.css';

const AudioPlayer = () => {
    const { 
        currentTrack, 
        isPlaying, 
        duration,
        currentTime,
        togglePlayPause, 
        playNextTrack, 
        playPreviousTrack,
        seekTo,
        formatTime,
        addToLikedTracks,
        removeFromLikedTracks,
        isTrackLiked
    } = useContext(PlayerContext);
    
    const { isAuthenticated } = useAuth();
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [liked, setLiked] = useState(false);
    const timelineRef = useRef(null);
    const lastTimeRef = useRef(currentTime);

    // Keep track of the last time when paused
    useEffect(() => {
        if (!isDragging) {
            setSliderPosition(currentTime);
            lastTimeRef.current = currentTime;
        }
    }, [currentTime, isDragging]);

    // Update slider position while dragging
    useEffect(() => {
        if (!isDragging) {
            setSliderPosition(currentTime);
        }
    }, [currentTime, isDragging]);
    
    // Update like status when track changes
    useEffect(() => {
        if (currentTrack) {
            setLiked(isTrackLiked(currentTrack.id));
        }
    }, [currentTrack, isTrackLiked]);

    if (!currentTrack) return null;

    const handleTimelineClick = (e) => {
        if (!timelineRef.current) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        seekTo(newTime);
    };
    
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            alert('Please login to like songs');
            return;
        }
        
        try {
            if (liked) {
                await removeFromLikedTracks(currentTrack.id);
                setLiked(false);
            } else {
                await addToLikedTracks(currentTrack);
                setLiked(true);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleTimelineChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setSliderPosition(newTime);
        if (!isDragging) {
            seekTo(newTime);
        }
    };

    return (
        <div className={styles.playerContainer}>
            <div className={styles.playerContent}>
                <div className={styles.trackInfo}>
                    <img 
                        src={
                            currentTrack.coverImage?.startsWith('http')
                                ? currentTrack.coverImage
                                : currentTrack.coverImage
                                    ? `${import.meta.env.VITE_API_BASE_URL}/images/${currentTrack.coverImage}`
                                    : new URL('../../assets/default-thumbnail.jpg', import.meta.url).href
                        }
                        alt={currentTrack.name} 
                        className={styles.albumCover}
                    />
                    <div className={styles.trackDetails}>
                        <div className={styles.trackNameContainer}>
                            <h4 className={styles.trackName}>{currentTrack.name}</h4>
                            <button 
                                className={styles.likeButton}
                                onClick={handleToggleLike}
                                title={liked ? 'Unlike' : 'Like'}
                            >
                                {liked ? 
                                    <FaHeart className={styles.heartIconFilled} /> : 
                                    <FiHeart className={styles.heartIcon} />
                                }
                            </button>
                        </div>
                        <p className={styles.artistName}>{currentTrack.artistName}</p>
                    </div>
                </div>

                <div className={styles.mainSection}>
                    <div className={styles.controls}>
                        <button onClick={playPreviousTrack} className={styles.controlButton}>
                            <FaStepBackward />
                        </button>
                        
                        <button onClick={togglePlayPause} className={`${styles.controlButton} ${styles.playPauseButton}`}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        
                        <button onClick={playNextTrack} className={styles.controlButton}>
                            <FaStepForward />
                        </button>
                    </div>

                    <div className={styles.timelineContainer}>
                        <span className={styles.time}>{formatTime(currentTime)}</span>
                        <div className={styles.timeline} ref={timelineRef}>
                            <div 
                                className={styles.progressTrack}
                                onClick={handleTimelineClick}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={isDragging ? sliderPosition : currentTime}
                                    onChange={handleTimelineChange}
                                    onMouseDown={() => setIsDragging(true)}
                                    onMouseUp={(event) => {
                                        setIsDragging(false);
                                        const newTime = parseFloat(event.target.value);
                                        setSliderPosition(newTime);
                                        seekTo(newTime);
                                    }}
                                    onTouchStart={() => setIsDragging(true)}
                                    onTouchEnd={(event) => {
                                        setIsDragging(false);
                                        const newTime = parseFloat(event.target.value);
                                        setSliderPosition(newTime);
                                        seekTo(newTime);
                                    }}
                                    className={styles.timelineSlider}
                                />
                                <div 
                                    className={styles.progressFill}
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className={styles.time}>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
