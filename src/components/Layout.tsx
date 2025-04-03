import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Layout.module.css';
import UserMenu from './UserMenu';

const Layout = () => {
    const { user, userData } = useAuth();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Find your perfect dog</h2>
                <nav className={styles.nav}>
                    {user ? <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        Home
                    </NavLink> : null}
                    {user ? <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        About
                    </NavLink> : null}

                    {user ? <NavLink
                        to="/uploader"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        Identify Breeds
                    </NavLink> : null}
                    {(userData?.role === 'admin') ? <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
                        }
                    >
                        Admin Board
                    </NavLink> : null}

                </nav>
                <UserMenu />
            </header>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
