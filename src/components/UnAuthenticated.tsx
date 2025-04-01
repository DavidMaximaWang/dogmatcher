import { useLocation } from 'react-router-dom';
import data from '../../assets/staticdogs.json';
import styles from '../styles/UnAuthenticated.module.css';
import DogCard from './DogCard';
import ReplaceLink from './ReplaceLink';

function UnAuthenticated() {
    const location = useLocation()
    return (
        <div className={styles.container}>
            <p className={styles.loginTop}>
                To see more <ReplaceLink to="/login" state={{ backgroundLocation: location }}  >Login</ReplaceLink> {' '} Need an account? <ReplaceLink to="/register" state={{ backgroundLocation: location }} >Register</ReplaceLink>
            </p>
            {data.map((d, index) => (
                <div className={`${styles.scatterItem} ${styles[`pos${index}`]}`} key={d.id}>
                    <DogCard dog={d} />
                </div>
            ))}
        </div>
    );
}

export default UnAuthenticated;
