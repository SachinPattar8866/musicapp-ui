// src/components/Navbar/Navbar.jsx (Example - Adjust to your actual component structure)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styles from './Navbar.module.css'; // Assuming your Navbar CSS

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        if (searchTerm.trim()) {
            // Navigate to the /search page, passing the search term as a query parameter
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            // Optionally clear the search term after submitting
            setSearchTerm('');
        }
    };

    return (
        <nav className={styles.navbar}> {/* Or your main navbar container class */}
            {/* ... Your existing logo/title elements if any ... */}

            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Search songs, artists, albums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>Search</button>
            </form>

            {/* ... Your existing user/guest/profile icon elements ... */}
        </nav>
    );
};

export default Navbar;