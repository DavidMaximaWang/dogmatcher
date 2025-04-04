import { useLocation } from 'react-router-dom';
import styles from '../styles/UnAuthenticated.module.css';
import ReplaceLink from './ReplaceLink';
import GoogleLoginButton from './GoogleLoginButton';

function LoginLinks() {
    const location = useLocation();

    return (
        <p className={styles.loginTop}>
            To see more{' '}
            <ReplaceLink to="/login" state={{ backgroundLocation: location }}>
                Login
            </ReplaceLink>{' '}
            Need an account?{' '}
            <ReplaceLink to="/register" state={{ backgroundLocation: location }}>
                Register
            </ReplaceLink>
            <GoogleLoginButton/>
        </p>
    );
}

export default LoginLinks;
