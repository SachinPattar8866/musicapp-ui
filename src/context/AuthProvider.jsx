// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken, storeToken, removeToken } from '../utils/jwtUtils';
import authService from '../services/authService';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUserFromToken());
    const navigate = useNavigate();

    const login = async ({ email, password }) => {
        try {
            const res = await authService.login({ email, password });
            storeToken(res.token);
            setUser(getUserFromToken());
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            throw err;
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const userFromToken = getUserFromToken();
        console.log('[AuthProvider] user from token:', userFromToken);
        setUser(userFromToken);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;