import { useEffect, useRef, useState } from 'react';
import styles from '../styles/UserMenu.module.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserMenu() {
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    // Detect outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) {
        return null;
    }

    return (
        <div
            ref={menuRef}
            className={styles.menuWrapper}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link to={`/profile/${user.uid}`} className={styles.menuButton}>
                {user.email}
            </Link>

            {open && (
                <div className={styles.dropdown}>
                    <button onClick={logout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
