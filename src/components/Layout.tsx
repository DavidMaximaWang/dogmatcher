import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Layout.module.css';
import UserMenu from './UserMenu';

// const hasPasswordProvider = () => auth.currentUser?.providerData.some((provider) => provider.providerId === 'password');

const Layout = () => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const handleClick = () => {
        if (user) {
            navigate('/(authenticated)');
        } else {
            navigate('/(unauthenticated)');
        }
    };

    // if (user && !hasPasswordProvider()) {
    //     return <Navigate to="/set-password" />;
    // }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                    Find your perfect dog
                </h2>
                <nav className={styles.nav}>
                    {user ? (
                        <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                            Home
                        </NavLink>
                    ) : null}
                    <NavLink to="/screens" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                        <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="icon" style={{ width: 20, height: 20, marginRight: 8, verticalAlign: 'middle' }} />
                        Some screens
                    </NavLink>

                    {user ? (
                        <NavLink to="/uploader" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                            Identify Breeds
                        </NavLink>
                    ) : null}
                    {userData?.role === 'admin' ? (
                        <NavLink to="/admin" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                            Admin Board
                        </NavLink>
                    ) : null}
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
