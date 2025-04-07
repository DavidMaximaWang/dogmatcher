import data from '../../assets/staticdogs.json';
import styles from '../styles/UnAuthenticated.module.css';
import DogDisplayCard from './DogDisplayCard';
import LoginLinks from './LoginLinks';

function UnAuthenticated() {

    return (
        <div className={styles.container}>
            <LoginLinks/>
            {data.map((d, index) => (
                <div className={`${styles.scatterItem} ${styles[`pos${index}`]}`} key={d.id}>
                    <DogDisplayCard dog={d} />
                </div>
            ))}
        </div>
    );
}

export default UnAuthenticated;
