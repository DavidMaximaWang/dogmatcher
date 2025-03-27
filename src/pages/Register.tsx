import React from 'react';
import { Link } from 'react-router-dom';
import EmailVerificationNotice from '../components/EmailVerificationNotice';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';


function Register() {
    const { register } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [registered, setRegistered] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(email, password);
            setError('');
            setRegistered(true);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <h1>Register</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
                <p className={styles.registerLink}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
                {registered && <EmailVerificationNotice />}
            </div>
        </div>
    );
}

export default Register;
