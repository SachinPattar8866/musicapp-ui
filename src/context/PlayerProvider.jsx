// src/context/PlayerProvider.jsx

import React, { useState, useRef, useEffect } from 'react';
import { PlayerContext } from './PlayerContext';

const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;
        let lastPlayedTime = currentTime;

        // Setup audio event listeners
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            lastPlayedTime = audio.currentTime;
            // Update progress bar CSS variable
            const progress = (audio.currentTime / audio.duration) * 100;
            document.documentElement.style.setProperty('--progress', `${progress}%`);
        };
        
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            if (lastPlayedTime > 0) {
                audio.currentTime = lastPlayedTime;
            } else {
                setCurrentTime(0);
            }
            document.documentElement.style.setProperty('--progress', `${(lastPlayedTime / audio.duration) * 100}%`);
        };
        
        const handleEnded = () => {
            document.documentElement.style.setProperty('--progress', '0%');
            setCurrentTime(0);
            lastPlayedTime = 0;
            playNextTrack();
        };

        const handlePause = () => {
            lastPlayedTime = audio.currentTime;
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('pause', handlePause);

        if (currentTrack) {
            if (audio.src !== currentTrack.audioUrl) {
                const previousTime = lastPlayedTime;
                audio.src = currentTrack.audioUrl;
                audio.load();
                lastPlayedTime = previousTime;
            }

            if (isPlaying) {
                audio.play().catch(e => console.error("Audio playback failed:", e));
            } else {
                audio.pause();
            }
        } else {
            audio.pause();
            audio.src = "";
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = "";
        };
    }, [currentTrack, isPlaying]);

    const playTrack = (track, trackList = []) => {
        if (!track || !track.audioUrl) {
            console.warn("Attempted to play a track without an audio source:", track);
            return;
        }

        // Update playlist if a new tracklist is provided
        if (trackList.length > 0) {
            setPlaylist(trackList);
            const index = trackList.findIndex(t => t.id === track.id);
            setCurrentIndex(index);
        } else if (playlist.length > 0) {
            const index = playlist.findIndex(t => t.id === track.id);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }

        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const playNextTrack = () => {
        if (playlist.length === 0 || currentIndex === -1) return;
        
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentIndex(nextIndex);
        playTrack(playlist[nextIndex]);
    };

    const playPreviousTrack = () => {
        if (playlist.length === 0 || currentIndex === -1) return;
        
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentIndex(prevIndex);
        playTrack(playlist[prevIndex]);
    };

    const seekTo = (time) => {
        const audio = audioRef.current;
        if (audio) {
            if (time >= 0 && time <= audio.duration) {
                audio.currentTime = time;
                setCurrentTime(time);
                const progress = (time / audio.duration) * 100;
                document.documentElement.style.setProperty('--progress', `${progress}%`);
            }
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                duration,
                currentTime,
                playlist,
                currentIndex,
                playTrack,
                togglePlayPause,
                playNextTrack,
                playPreviousTrack,
                seekTo,
                formatTime
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerProvider;