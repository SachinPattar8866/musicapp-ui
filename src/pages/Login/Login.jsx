import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { storeToken } from '../../utils/jwtUtils';
import useAuth from '../../hooks/useAuth';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await authService.login({ email, password });
            storeToken(token);
            const user = await authService.getProfile();
            setUser(user);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }

    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.heading}>Login to Your Account</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className={styles.button} type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
