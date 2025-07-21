import React, { useContext, useState, useRef, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import styles from './AudioPlayer.module.css';

const AudioPlayer = () => {
    const { currentTrack, isPlaying, togglePlayPause, playNext, playPrev } = useContext(PlayerContext);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => {});
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            const current = audio.currentTime;
            const total = audio.duration || 1;
            setProgress((current / total) * 100);
        };

        audio?.addEventListener('timeupdate', updateProgress);

        return () => {
            audio?.removeEventListener('timeupdate', updateProgress);
        };
    }, [currentTrack]);

    if (!currentTrack) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-50 ${styles.playerBar}`}>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Song Info */}
                <div className="flex items-center gap-4">
                    <img
                        src={currentTrack?.thumbnail || '/default-thumbnail.jpg'}
                        alt={currentTrack.title}
                        className="w-12 h-12 rounded"
                    />
                    <div>
                        <h4 className="font-semibold text-sm">{currentTrack.title}</h4>
                        <p className="text-xs text-gray-300">{currentTrack.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button onClick={playPrev}><FaStepBackward /></button>
                    <button onClick={togglePlayPause} className="text-xl">
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={playNext}><FaStepForward /></button>
                </div>

                {/* Progress Bar */}
                <div className="w-full absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div
                        className="h-full bg-red-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <audio ref={audioRef} src={currentTrack.url} />
            </div>
        </div>
    );
};

export default AudioPlayer;
