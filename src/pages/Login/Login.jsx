import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { storeToken, getUserFromToken } from '../../utils/jwtUtils';
import useAuth from '../../hooks/useAuth';
import styles from './Login.module.css';
import { FaGoogle } from 'react-icons/fa';

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
            setUser(getUserFromToken());
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>Musicify</h1>
                    <h2 className={styles.heading}>Sign in</h2>
                    <p className={styles.subheading}>to continue to YouTube Music</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.inputGroup}>
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
                    </div>

                    <div className={styles.helpLinks}>
                        <Link to="/forgot-password" className={styles.link}>
                            Forgot password?
                        </Link>
                    </div>

                    <div className={styles.googleSignIn}>
                        <button type="button" className={styles.googleButton}>
                            <FaGoogle className={styles.googleIcon} />
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <Link to="/register" className={styles.link}>
                            Create account
                        </Link>
                        <button className={styles.button} type="submit">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
