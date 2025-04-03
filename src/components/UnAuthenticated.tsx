import data from '../../assets/staticdogs.json';
import styles from '../styles/UnAuthenticated.module.css';
import DogCard from './DogCard';
import LoginLinks from './LoginLinks';

function UnAuthenticated() {

    return (
        <div className={styles.container}>
            <LoginLinks/>
            {data.map((d, index) => (
                <div className={`${styles.scatterItem} ${styles[`pos${index}`]}`} key={d.id}>
                    <DogCard dog={d} />
                </div>
            ))}
        </div>
    );
}

export default UnAuthenticated;
