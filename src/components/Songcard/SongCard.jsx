// src/components/SongCard/SongCard.jsx

import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext'; // Assuming this context
import styles from './SongCard.module.css'; // Assuming you have a CSS module for SongCard

const SongCard = ({ song }) => {
    const { playTrack } = useContext(PlayerContext); // Assuming playTrack function

    const handlePlay = () => {
        playTrack(song);
    };

    // --- CRITICAL CHANGE HERE ---
    // Construct the URL to your new image proxy endpoint
    // It will look like: /api/image-proxy?imageUrl=https%3A%2F%2Fusercontent.jamendo.com%2F...
    const proxiedImageUrl = song.coverImage
        ? `/api/image-proxy?imageUrl=${encodeURIComponent(song.coverImage)}`
        : '/default-thumbnail.jpg'; // Fallback to a local default image if no coverImage URL is present

    return (
        <div
            className={`bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${styles.card}`}
            onClick={handlePlay}
        >
            <img
                src={proxiedImageUrl} // <--- This is the key: Use the URL that points to your backend proxy
                alt={song.name} // Always provide an alt text for accessibility
                className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-white font-semibold text-sm truncate">{song.name}</h3>
            <p className="text-gray-400 text-xs">{song.artistName}</p>
        </div>
    );
};

export default SongCard;