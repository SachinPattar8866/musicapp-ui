// src/layout/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer.jsx';
import styles from './MainLayout.module.css';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Navbar />
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
                <AudioPlayer />
            </div>
        </div>
    );
};

export default MainLayout;
