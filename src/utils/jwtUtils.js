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
    if (!token) {
        console.warn('[jwtUtils] No token found in localStorage');
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        console.log('[jwtUtils] Decoded token:', decoded);
        let username = 'User';
        if (decoded.name) {
            username = decoded.name;
        } else if (decoded.firstName || decoded.lastName) {
            username = `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim();
        } else if (decoded.email) {
            username = decoded.email.split('@')[0];
        }
        return {
            id: decoded.id || decoded.sub || decoded.userId,
            username: username,
            name: decoded.name || username,
            email: decoded.email || 'Not available',
            roles: decoded.roles || decoded.authorities || []
        };
    } catch (error) {
        console.error('[jwtUtils] Error decoding token:', error);
        return null;
    }
};
