import { useLocation } from 'react-router-dom';
import UnAuthenticated from './UnAuthenticated';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Modal from './Modal';

export default function UnauthenticatedWithModal() {
    const location = useLocation();

    const isLogin = location.pathname === '/login';
    const isRegister = location.pathname === '/register';

    return (
        <>
            <UnAuthenticated />
            {isLogin && ( <Modal> <div className="modal"> <Login /> </div> </Modal> )}
            {isRegister && ( <Modal> <div className="modal"> <Register /> </div> </Modal> )}
        </>
    );
}
