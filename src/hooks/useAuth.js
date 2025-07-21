// src/hooks/useAuth.js (or similar)
import { useState, useEffect } from 'react';
import { getUserFromToken, removeToken } from '../utils/jwtUtils'; // Make sure paths are correct

const useAuth = () => {
    const [user, setUser] = useState(null); // Define user state and its setter

    // Optional: Load user from token on initial render
    useEffect(() => {
        const decodedUser = getUserFromToken();
        if (decodedUser) {
            setUser(decodedUser);
        } else {
            removeToken(); // Clear invalid token
        }
    }, []);

    // Other auth related functions can be returned here
    // e.g., login, logout methods that update the 'user' state
    const logout = () => {
        removeToken();
        setUser(null);
        // navigate('/login'); // If you want to redirect after logout
    };

    return {
        user,
        setUser, // <--- THIS IS WHAT'S MISSING OR INCORRECTLY RETURNED
        logout,
        // ... any other auth-related functions/data
    };
};

export default useAuth;