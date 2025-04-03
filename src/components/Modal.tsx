import { useLocation, useNavigate } from 'react-router-dom';
import './Modal.css';

export default function Modal({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;
    const pathname = location.pathname;
    const handleClose = () => {
        if (backgroundLocation) {
            navigate(backgroundLocation?.pathname, { replace: true });
        } else if (pathname === '/login' || pathname === '/register') {
            navigate('/default', { replace: true });
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="modal-backdrop" onMouseDown={handleClose}>
            <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
