import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'musicapp_token';

export const storeToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug log to see what's in the token
        
        // Simply set username to 'User' for now, we'll add logic to extract the name
        let username = 'User';
        
        // Check if name property exists directly
        if (decoded.name) {
            username = decoded.name;
        } 
        // If no name property but has firstName/lastName, combine them
        else if (decoded.firstName || decoded.lastName) {
            username = `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim();
        }
        // If email exists, use part before @ as fallback
        else if (decoded.email) {
            username = decoded.email.split('@')[0];
        }
        
        return {
            id: decoded.id || decoded.sub || decoded.userId,
            username: username, // This will be displayed in the UI
            name: decoded.name || username, // Alternative name field
            email: decoded.email || 'Not available',
            // Add other user properties as needed
            roles: decoded.roles || decoded.authorities || []
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
