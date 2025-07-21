import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlaylistCard.module.css';

const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/playlist/${playlist.id}`);
    };

    return (
        <div
            className={`bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${styles.card}`}
            onClick={handleClick}
        >
            <img
                src={playlist.thumbnail || '/default-thumbnail.jpg'}
                alt={playlist.name}
                className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-white font-semibold text-sm truncate">{playlist.name}</h3>
            <p className="text-gray-400 text-xs">{playlist.songs.length} songs</p>
        </div>
    );
};

export default PlaylistCard;
