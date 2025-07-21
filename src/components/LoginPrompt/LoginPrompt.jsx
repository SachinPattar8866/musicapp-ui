
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPrompt.module.css';

const LoginPrompt = ({ message = "Sign in to access this feature." }) => {
    return (
        <div className={styles.promptContainer}>
            <div className={styles.promptCard}>
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
