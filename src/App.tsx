import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AdminBoard from './components/AdminBoard';
import DogDetailsPage from './components/DogDetailsPage';
import Layout from './components/Layout';
import ProfilePage from './components/ProfilePage';
import UnAuthenticated from './components/UnAuthenticated';
import UnauthenticatedWithModal from './components/UnauthenticatedWithModal';
import Uploader from './components/Uploader';
import { useAuth } from './context/AuthContext';
import DogsContextProvider from './context/DogsContextProvider';
import About from './pages/About';
import Home from './pages/Home';

function AuthenticatedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dogs/:id" element={<DogDetailsPage />} />
            <Route path="/profile/:uid" element={<ProfilePage />} />
            <Route path="/uploader" element={<Uploader />} />
            <Route path="/admin" element={<AdminBoard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    const location = useLocation();
    const state = location.state as { backgroundLocation?: Location };
    const background = state?.backgroundLocation;
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <>
            <Toaster position="top-right" />
            <Routes location={background || location}>
                <Route element={<Layout />}>
                    <Route path="/default" element={user ? <Navigate to="/" replace /> : <UnAuthenticated />} />
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                    <Route path="/register" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                    <Route path="/screens" element={<About />} />
                </Route>
                {user && (
                    <Route element={<Layout />}>
                        <Route path="*" element={ <DogsContextProvider> <AuthenticatedRoutes /> </DogsContextProvider> } />
                    </Route>
                )}
                <Route path="*" element={<Navigate to="/default" replace />} />
            </Routes>
            {background && (
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                    <Route path="/register" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                </Routes>
            )}
        </>
    );
}

export default App;

