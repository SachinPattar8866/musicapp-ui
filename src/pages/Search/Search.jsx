// src/pages/Search/Search.jsx (Verify this structure)

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- This is key
import musicService from '../../services/musicService';
import SongCard from '../../components/Songcard/SongCard';
import styles from './Search.module.css';

const Search = () => {
    const [searchParams] = useSearchParams(); // Remove setSearchParams
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get the initial search query from the URL (e.g., /search?q=rock)
    const currentQuery = searchParams.get('q') || ''; // <-- Reads the 'q' parameter

    useEffect(() => {
        // Only perform search if there's a query in the URL
        if (currentQuery) {
            performSearch(currentQuery);
        } else {
            setSearchResults([]); // Clear results if no query
        }
    }, [currentQuery]); // <-- IMPORTANT: Re-run effect when the 'q' parameter in the URL changes

    const performSearch = async (query) => {
        try {
            setLoading(true);
            setError(null);
            // Replace with your actual search API call that hits your backend!
            const data = await musicService.searchTracks(query); // <-- You need this function in musicService.js
            setSearchResults(data);
        } catch (err) {
            console.error('Error during search:', err);
            setError('Failed to perform search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* REMOVED: The local search bar from here as it's now handled by Navbar */}

            <h2 className={styles.sectionTitle}>
                {currentQuery ? `Search Results for "${currentQuery}"` : 'Discover Music'}
            </h2>

            {loading && <p className={styles.loadingMessage}>Searching...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {!loading && !error && currentQuery && searchResults.length === 0 ? (
                <p className={styles.noResultsMessage}>No results found for "{currentQuery}".</p>
            ) : !loading && !error && !currentQuery ? (
                <p className={styles.promptText}>Type in the search bar above to find songs, artists, or albums.</p>
            ) : null}


            <div className={styles.resultsGrid}>
                {searchResults.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </div>
    );
};

export default Search;