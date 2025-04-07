import React, { useActionState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import EmailVerificationNotice from '../components/EmailVerificationNotice';
import GoogleLoginButton from '../components/GoogleLoginButton';

const loginAction = async (_previousState: any, formData: FormData, login: (email: string, password: string) => Promise<void>) => {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        if (!email || !password) {
            return { error: 'Please fill in all fields', isVerified: false, success: false };
        }
        await login(email, password);
        await auth.currentUser?.reload(); // refresh user data
        const isVerified = auth.currentUser?.emailVerified;

        if (!isVerified) {
            return {
                error: 'Please verify your email before logging in.',
                isVerified: false,
                success: false
            };
        }

        return {
            error: '',
            isVerified: true,
            success: true
        };
    } catch (err: any) {
        return {
            error: 'Login failed, invalid email or password',
            isVerified: false,
            success: false
        };
    }
};

const defaultFormState = { success: false, error: '', isVerified: true };

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formState, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return loginAction(prevState, formData, login);
    }, defaultFormState);

    React.useEffect(() => {
        if (formState?.success) {
            navigate('/', { replace: true });
        }
    }, [formState, navigate]);

    const { error, isVerified } = formState || defaultFormState;

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <h1>Login</h1>
                <form action={formAction} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <button type="submit" className={`${styles.button} ${isPending ? styles.loading : ''}`} disabled={isPending}>
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                    {!isVerified && <EmailVerificationNotice />}
                </form>
                <p className={styles.registerLink}>
                    Don’t have an account? <Link to="/register">Register here</Link>
                </p>
                <div className={styles.fullWidth}>
                    <GoogleLoginButton />
                </div>
            </div>
        </div>
    );
}

export default Login;
