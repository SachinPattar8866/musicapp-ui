import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaSearch } from 'react-icons/fa';
import { BsCast } from 'react-icons/bs';
import { IoMdSettings, IoMdNotificationsOutline } from 'react-icons/io';
import { RiMusicFill } from 'react-icons/ri';
import defaultAvatar from '../../assets/default-avatar.png';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    
    // Debug log to see user data
    console.log('Auth user data:', user, 'isAuthenticated:', isAuthenticated);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/login');
    };
    
    const handleLogin = () => {
        setShowDropdown(false);
        navigate('/login');
    };


    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <div className={styles.logoSection}>
                    <RiMusicFill className={styles.logoIcon} />
                    <span className={styles.logoText}>Musicify</span>
                </div>
            </div>
            
            <div className={styles.middleSection}>
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search songs, artists, albums..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </form>
            </div>

            <div className={styles.rightSection}>
                <button className={styles.iconButton}>
                    <BsCast />
                </button>
                <button className={styles.iconButton}>
                    <IoMdNotificationsOutline />
                </button>
                <button className={styles.iconButton}>
                    <IoMdSettings />
                </button>
                <div className={styles.profileSection} onClick={handleProfileClick} tabIndex={0} ref={dropdownRef}>
                    <img src={defaultAvatar} alt="Profile" className={styles.avatar} />
                    <span style={{ marginLeft: 8, color: '#fff', fontWeight: 500, fontSize: 15 }}>
                        {isAuthenticated ? user?.name || user?.username : 'Sign In'}
                    </span>
                    {showDropdown && (
                        <div className={styles.profileDropdown}>
                            {isAuthenticated ? (
                                <>
                                    <div className={styles.profileInfo}>
                                        <img src={defaultAvatar} alt="Profile" className={styles.avatarLarge} />
                                        <div>
                                            <div className={styles.profileName}>{user?.name || user?.username}</div>
                                            <div className={styles.profileEmail}>{user?.email}</div>
                                        </div>
                                    </div>
                                    <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <button className={styles.logoutButton} onClick={handleLogin}>Login</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;