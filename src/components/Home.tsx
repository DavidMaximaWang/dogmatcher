import DogSearch from './DogSearch';
import styles from './Home.module.css';

function Home({ handleLogout }: { handleLogout: () => void }) {
    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h2>Find your perfect dog</h2>
                <button onClick={handleLogout} className={styles['logout-btn']}>
                    Logout
                </button>
            </header>
            <DogSearch />
        </div>
    );
}

export default Home;
