// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // This is the ONLY BrowserRouter instance
import App from './App';
import './styles/tailwind.css';
import AuthProvider from './context/AuthProvider.jsx';
import PlayerProvider from './context/PlayerProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* This is the ONE AND ONLY BrowserRouter for your entire application */}
        <BrowserRouter>
            {/* Context providers that need router access must be children of BrowserRouter */}
            <AuthProvider>
                <PlayerProvider>
                    <App /> {/* App will render AppRoutes, which defines the Routes */}
                </PlayerProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);