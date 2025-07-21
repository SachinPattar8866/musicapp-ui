// src/components/Sidebar/Sidebar.jsx (RE-UPDATED FOR CLARITY)
import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg?react';
import SearchIcon from '../../assets/icons/search.svg?react';
import LibraryIcon from '../../assets/icons/library.svg?react';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h1>Musicify</h1>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    <HomeIcon className={styles.icon} /> Home
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    <SearchIcon className={styles.icon} /> Search
                </NavLink>
                <NavLink to="/library" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    <LibraryIcon className={styles.icon} /> Library
                </NavLink>
            </nav>

            <div className={styles.playlists}>
                <h3 className={styles.playlistSectionTitle}>Your Playlists</h3> {/* Add this title */}

                {/* Convert these to NavLinks */}
                <NavLink to="/liked-songs" className={({ isActive }) => isActive ? styles.playlistItemActive : styles.playlistItem}>
                    Liked Songs
                </NavLink>
                <NavLink to="/playlist/workout-vibes" className={({ isActive }) => isActive ? styles.playlistItemActive : styles.playlistItem}>
                    Workout Vibes
                </NavLink>
                <NavLink to="/playlist/chillout" className={({ isActive }) => isActive ? styles.playlistItemActive : styles.playlistItem}>
                    Chillout
                </NavLink>
                <NavLink to="/playlist/party-hits" className={({ isActive }) => isActive ? styles.playlistItemActive : styles.playlistItem}>
                    Party Hits
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;