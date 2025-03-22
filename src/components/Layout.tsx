import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Layout.module.css';

const Layout = () => {
    const { logout } = useAuth();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Find your perfect dog</h2>
                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        About
                    </NavLink>
                </nav>
                <button onClick={logout} className={styles.logoutButton}>
                    Logout
                </button>
            </header>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
