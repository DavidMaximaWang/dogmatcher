import DogSearch from './DogSearch';
import styles from './Home.module.css';

function Home({ handleLogout }: { handleLogout: () => void }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Find your perfect dog</h2>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </header>
            <main className={styles.mainContent}>
                <DogSearch />
            </main>
            {/* <footer className={styles.footer}>
                <p>© 2021 Doggo, Inc.</p>
            </footer> */}
        </div>
    );
}

export default Home;
