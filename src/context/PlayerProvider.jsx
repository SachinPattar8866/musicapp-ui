// src/context/PlayerProvider.jsx

import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import useAuth from '../hooks/useAuth';
import { PlayerContext } from './PlayerContext';
import likeService from '../services/likeService';
import historyService from '../services/historyService';

const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [likedTracks, setLikedTracks] = useState([]);
    const audioRef = useRef(new Audio());
    
    // No longer needed after refactoring the useEffect hook
    // const historyUpdatedRef = useRef(false);
    
    const { user } = useAuth();
    
    // ... (rest of the code for fetching liked tracks remains the same) ...
    useEffect(() => {
        const fetchLikedTracks = async () => {
            if (!user) {
                setLikedTracks([]);
                return;
            }
            try {
                let tracks;
                try {
                    tracks = await likeService.getLikedTracks();
                } catch (likeError) {
                    console.log('Error with likeService, trying musicService:', likeError);
                    const musicService = await import('../services/musicService');
                    tracks = await musicService.default.getLikedSongs();
                }
                console.log('Fetched liked tracks in PlayerProvider:', tracks);
                setLikedTracks(Array.isArray(tracks) ? tracks : []);
            } catch (error) {
                console.error('Error fetching liked tracks:', error);
                setLikedTracks([]);
            }
        };
        fetchLikedTracks();
    }, [user]);

    const addToHistory = useCallback(async (track) => {
        if (!user) {
            console.log("User not logged in, skipping adding track to history.");
            return false;
        }
        try {
            if (!track || !track.id) {
                console.warn("Attempted to add an invalid track to history:", track);
                return false;
            }
            const payload = { trackId: track.id };
            console.log("Adding track to history with payload:", payload);
            await historyService.addToHistory(payload);
            return true;
        } catch (error) {
            console.error('Error adding to history:', error);
            return false;
        }
    }, [user]);

    // Use two separate useEffect hooks for better control
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => playNextTrack();

        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [playNextTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        let lastPlayedTime = currentTime;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            lastPlayedTime = audio.currentTime;
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
        
        const handlePause = () => {
            lastPlayedTime = audio.currentTime;
        };
        
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('pause', handlePause);

        if (currentTrack) {
            // Check if the track has changed before updating the source
            if (audio.src !== currentTrack.audioUrl) {
                audio.src = currentTrack.audioUrl;
                audio.load();
                // We moved addToHistory to playTrack function for better control
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
            audio.removeEventListener('pause', handlePause);
        };
    }, [currentTrack, isPlaying, currentTime]); // Dependencies for this effect

    const playTrack = (track, trackList = []) => {
        if (!track || !track.audioUrl) {
            console.warn("Attempted to play a track without an audio source:", track);
            return;
        }
        
        // If the new track is the same as the current one, just toggle play/pause
        if (currentTrack && currentTrack.id === track.id) {
            togglePlayPause();
            return;
        }

        let newPlaylist = [];
        let newIndex = -1;

        if (trackList.length > 0) {
            newPlaylist = trackList;
            newIndex = newPlaylist.findIndex(t => t.id === track.id);
        } else {
            newPlaylist = [track];
            newIndex = 0;
        }
        
        // Update playlist state if it has changed
        if (newPlaylist !== playlist) {
            setPlaylist(newPlaylist);
        }
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
        
        // This is the correct place to call addToHistory - only when a new track is selected
        addToHistory(track);
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const playNextTrack = useCallback(() => {
        if (playlist.length === 0) {
            console.log("Cannot play next track: playlist is empty.");
            return;
        }
        const nextIndex = (currentIndex + 1) % playlist.length;
        playTrack(playlist[nextIndex], playlist); // Pass the playlist to playTrack
    }, [currentIndex, playlist, playTrack]);

    const playPreviousTrack = useCallback(() => {
        if (playlist.length === 0) {
            console.log("Cannot play previous track: playlist is empty.");
            return;
        }
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playTrack(playlist[prevIndex], playlist); // Pass the playlist to playTrack
    }, [currentIndex, playlist, playTrack]);

    const seekTo = (time) => {
        const audio = audioRef.current;
        if (audio) {
            if (time >= 0 && time <= audio.duration) {
                audio.currentTime = time;
                setCurrentTime(time);
            }
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const addToLikedTracks = useCallback(async (track) => {
        if (!user) {
            console.log("User not logged in, skipping liking track.");
            return false;
        }
        try {
            await likeService.likeTrack(track.id);
            setLikedTracks(prev => [...prev, track]);
            return true;
        } catch (error) {
            console.error('Error liking track:', error);
            return false;
        }
    }, [user]);
    
    const removeFromLikedTracks = useCallback(async (trackId) => {
        if (!user) {
            console.log("User not logged in, skipping unliking track.");
            return false;
        }
        try {
            await likeService.unlikeTrack(trackId);
            setLikedTracks(prev => prev.filter(track => track.id !== trackId));
            return true;
        } catch (error) {
            console.error('Error unliking track:', error);
            return false;
        }
    }, [user]);
    
    const isTrackLiked = useCallback((trackId) => {
        return likedTracks.some(track => track.id === trackId);
    }, [likedTracks]);
    
    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                duration,
                currentTime,
                playlist,
                currentIndex,
                likedTracks,
                playTrack,
                togglePlayPause,
                playNextTrack,
                playPreviousTrack,
                seekTo,
                formatTime,
                addToLikedTracks,
                removeFromLikedTracks,
                isTrackLiked,
                addToHistory
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerProvider;