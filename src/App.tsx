import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Uploader from './components/Uploader';
import DogDetailsPage from './components/DogDetailsPage';
import Layout from './components/Layout';
import ProfilePage from './components/ProfilePage';
import UnAuthenticated from './components/UnAuthenticated';
import UnauthenticatedWithModal from './components/UnauthenticatedWithModal';
import { useAuth } from './context/AuthContext';
import DogsContextProvider from './context/DogsContextProvider';
import About from './pages/About';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import AdminBoard from './components/AdminBoard';

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
        <DogsContextProvider>
            <Routes location={background || location}>
                <Route element={<Layout />}>
                    <Route path="/default" element={user ? <Navigate to="/" replace /> : <UnAuthenticated />} />
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                    <Route path="/register" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                </Route>
                {user ? (
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/dogs/:id" element={<DogDetailsPage />} />
                        <Route path="/profile/:uid" element={<ProfilePage />} />
                        <Route path="/uploader" element={<Uploader />} />
                        <Route path="/admin" element={<AdminBoard />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                ) : (
                    <Route path="*" element={<Navigate to="/default" replace />} />
                )}
            </Routes>
            {(location.pathname === "/login" || location.pathname === "/register") && (
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />} />
                    <Route path="/register" element={user ? <Navigate to="/" replace /> : <UnauthenticatedWithModal />}  />
                </Routes>
            )}
        </DogsContextProvider>
        </>
    );
}

export default App;

