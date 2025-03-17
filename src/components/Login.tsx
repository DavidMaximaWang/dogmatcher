import React from 'react';
import styles from './Login.module.css';
import auth from '../services/auth';

function Login({handleLogin}: {handleLogin: () => void}) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name, email);
        auth.login(email, name).then(() => {
            setError('');
            handleLogin();
        })

    }
  return (
    <div className={styles.container}>

        <div className={styles.login}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

            <button type="submit" className={styles.button}>Login</button>
            {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    </div>
  )
}

export default Login