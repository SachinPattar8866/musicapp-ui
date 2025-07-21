// src/context/PlayerProvider.jsx

import React, { useState, useRef, useEffect } from 'react';
import { PlayerContext } from './PlayerContext';

const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        if (currentTrack) {
            // <-- CRITICAL CHANGE: Use currentTrack.audioUrl to match SongDTO
            if (audio.src !== currentTrack.audioUrl) {
                audio.src = currentTrack.audioUrl;
                audio.load();
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
            audio.pause();
            audio.src = "";
        };
    }, [currentTrack, isPlaying]);

    const playTrack = (track) => {
        // <-- CRITICAL CHANGE: Use track.audioUrl to match SongDTO
        if (!track || !track.audioUrl) {
            console.warn("Attempted to play a track without an audio source:", track);
            return;
        }
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const resumeTrack = () => {
        if (currentTrack) {
            setIsPlaying(true);
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                setCurrentTrack,
                isPlaying,
                setIsPlaying,
                playTrack,
                pauseTrack,
                resumeTrack,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerProvider;