import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaHistory } from 'react-icons/fa';
import { MdLibraryMusic, MdPlaylistPlay } from 'react-icons/md';
import { BiLike } from 'react-icons/bi';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <div className={styles.section}>
                    <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        <FaHome className={styles.icon} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/explore" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        <FaSearch className={styles.icon} />
                        <span>Explore</span>
                    </NavLink>
                    <NavLink to="/library" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        <MdLibraryMusic className={styles.icon} />
                        <span>Library</span>
                    </NavLink>
                </div>

                <div className={`${styles.section} ${styles.librarySection}`}>
                    <NavLink to="/liked-songs" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        <BiLike className={styles.icon} />
                        <span>Liked Songs</span>
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        <FaHistory className={styles.icon} />
                        <span>History</span>
                    </NavLink>
                </div>

                <div className={styles.playlistsSection}>
                    <h3 className={styles.playlistHeader}>PLAYLISTS</h3>
                    <div className={styles.playlistScroll}>
                        <NavLink to="/playlist/workout" className={({ isActive }) => `${styles.playlistLink} ${isActive ? styles.active : ''}`}>
                            <MdPlaylistPlay className={styles.icon} />
                            <span>Workout Mix</span>
                        </NavLink>
                        <NavLink to="/playlist/chill" className={({ isActive }) => `${styles.playlistLink} ${isActive ? styles.active : ''}`}>
                            <MdPlaylistPlay className={styles.icon} />
                            <span>Chill Vibes</span>
                        </NavLink>
                        <NavLink to="/playlist/favorites" className={({ isActive }) => `${styles.playlistLink} ${isActive ? styles.active : ''}`}>
                            <MdPlaylistPlay className={styles.icon} />
                            <span>Favorites</span>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;