import React, { useContext, useState, useRef, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
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
        formatTime
    } = useContext(PlayerContext);
    
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
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

    if (!currentTrack) return null;

    const handleTimelineClick = (e) => {
        if (!timelineRef.current) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        seekTo(newTime);
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
                        <h4 className={styles.trackName}>{currentTrack.name}</h4>
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
