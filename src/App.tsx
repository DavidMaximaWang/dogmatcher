import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import DogDetailsPage from './components/DogDetailsPage';
import Layout from './components/Layout';
import ProfilePage from './components/ProfilePage';
import UnAuthenticated from './components/UnAuthenticated';
import UnauthenticatedWithModal from './components/UnauthenticatedWithModal';
import { useAuth } from './context/AuthContext';
import DogsContextProvider from './context/DogsContextProvider';
import About from './pages/About';
import Home from './pages/Home';

function App() {
    const location = useLocation();
    const state = location.state as { backgroundLocation?: Location };
    const background = state?.backgroundLocation;
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }
    return (
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
                        {(isAdmin) && <Route path="/admin" element={<AdminDashboard />} />}
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
    );
}

export default App;

