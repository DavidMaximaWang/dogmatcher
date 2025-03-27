import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const { register } = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password);
            setError('');
            navigate('/'); // or navigate('/login') if you want login after registration
        } catch (err: any) {
            setError(err.message || 'Failed to register');
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
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Register;
