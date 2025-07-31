
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPrompt.module.css';

const LoginPrompt = ({ message = "Sign in to access this feature.", onClose }) => {
    return (
        <div className={styles.promptContainer}>
            <div className={styles.promptCard}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close login prompt"
                    style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    &times;
                </button>
                <h2 className={styles.heading}>Sign in required</h2>
                <p className={styles.message}>{message}</p>
                <Link to="/login" className={styles.loginButton}>
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default LoginPrompt;
