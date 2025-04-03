import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import EmailVerificationNotice from '../components/EmailVerificationNotice';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isVerified, setIsVerified] = React.useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            await auth.currentUser?.reload(); // refresh user data
            const isVerified = auth.currentUser?.emailVerified;

            if (!isVerified) {
                setIsVerified(false);
                setError('Please verify your email before logging in.');
                return;
            }
            setIsVerified(true);
            setError('');
            navigate('/', { replace: true });
        } catch (err: any) {
            setError('Login failed, invalid email or password');
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
                    {!isVerified && <EmailVerificationNotice />}
                </form>
                <p className={styles.registerLink}>
                    Don’t have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
