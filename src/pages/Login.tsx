import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            setError('');
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
                <p className={styles.registerLink}>
                    Don’t have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
