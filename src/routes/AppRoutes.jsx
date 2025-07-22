// src/routes/AppRoutes.jsx (VERIFY THESE ROUTES)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home/Home.jsx';
import Explore from '../pages/Explore/Explore.jsx';
import Search from '../pages/Search/Search.jsx';
import Library from '../pages/Library/Library.jsx';
import PlaylistDetailsPage from '../pages/PlaylistDetailsPage/PlaylistDetailsPage.jsx'; // Make sure this is correctly imported
import MusicDetails from '../pages/MusicDetails/MusicDetails.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import LikedSongsPage from '../pages/LikedSongsPage/LikedSongsPage.jsx'; // <-- Make sure this is imported
import History from '../pages/History/History.jsx'; // <-- Import History component

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/search" element={<Search />} />
                <Route path="/music/:id" element={<MusicDetails />} />
            </Route>

            {/* Protected Routes - require authentication */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}> 
                    <Route path="/library" element={<Library />} />
                    <Route path="/playlist/:id" element={<PlaylistDetailsPage />} />
                    <Route path="/liked-songs" element={<LikedSongsPage />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;