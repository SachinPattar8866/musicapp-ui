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

    // Track if the history update has been done for current track
    const historyUpdatedRef = useRef(false);

    // Fetch liked tracks only if user is authenticated
    const { user } = useAuth(); // <--- Correctly getting user here

    useEffect(() => {
        const fetchLikedTracks = async () => {
            if (!user) {
                setLikedTracks([]);
                return;
            }
            try {
                let tracks;
                try {
                    // First try likeService
                    tracks = await likeService.getLikedTracks();
                } catch (likeError) {
                    console.log('Error with likeService, trying musicService:', likeError);
                    // If that fails, try musicService directly
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

    // Function to add track to history - MODIFIED to be conditional on user
    const addToHistory = useCallback(async (track) => {
        if (!user) { // <--- ADDED: Only proceed if user is logged in
            console.log("User not logged in, skipping adding track to history.");
            return false; // Indicate that history was not updated
        }

        try {
            // Make sure we have a valid track with an ID
            if (!track || !track.id) {
                console.warn("Attempted to add an invalid track to history:", track);
                return false;
            }
            // Send only the required payload
            const payload = { trackId: track.id };
            console.log("Adding track to history with payload:", payload);
            await historyService.addToHistory(payload);
            return true;
        } catch (error) {
            console.error('Error adding to history:', error);
            return false;
        }
    }, [user]); // <--- ADDED: user as a dependency for useCallback

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

            // Add to history as soon as the song starts playing (even a fraction of a second)
            // The `addToHistory` function itself now handles the user check.
            if (audio.currentTime > 0 && !historyUpdatedRef.current && currentTrack) {
                // Ensure we only try to add to history if the user exists
                // The check `if (user)` is now inside `addToHistory`
                addToHistory(currentTrack);
                historyUpdatedRef.current = true;
            }
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
                // Reset history tracking for new track and add it to history immediately
                historyUpdatedRef.current = false;
                // The `addToHistory` function itself now handles the user check.
                addToHistory(currentTrack); // This call is fine, as addToHistory is now conditional
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
    }, [currentTrack, isPlaying, addToHistory]); // Added addToHistory to dependency array

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

        // Add to history immediately when track is selected to play
        // The `addToHistory` function itself now handles the user check.
        addToHistory(track); // This call is fine, as addToHistory is now conditional

        setCurrentTrack(track);
        setIsPlaying(true);

        // Reset history flag since we're playing a new track
        historyUpdatedRef.current = false;
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const playNextTrack = () => {
        if (playlist.length === 0 || currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentIndex(nextIndex);

        // Reset history flag for the new track
        historyUpdatedRef.current = false;
        playTrack(playlist[nextIndex]);
    };

    const playPreviousTrack = () => {
        if (playlist.length === 0 || currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentIndex(prevIndex);

        // Reset history flag for the new track
        historyUpdatedRef.current = false;
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

    // Function to add track to liked tracks - MODIFIED to be conditional on user
    const addToLikedTracks = useCallback(async (track) => {
        if (!user) { // <--- ADDED: Only proceed if user is logged in
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
    }, [user]); // <--- ADDED: user as a dependency

    // Function to remove track from liked tracks - MODIFIED to be conditional on user
    const removeFromLikedTracks = useCallback(async (trackId) => {
        if (!user) { // <--- ADDED: Only proceed if user is logged in
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
    }, [user]); // <--- ADDED: user as a dependency

    // Function to check if a track is liked
    // This function can remain as is, it only checks local state.
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
                addToHistory // Still export, but its internal logic is conditional
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerProvider;