import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import DogDetailsPage from './components/DogDetailsPage';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import DogsContextProvider from './context/DogsContextProvider';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import UnAuthenticated from './components/UnAuthenticated';

function App() {
    const { user, isAdmin } = useAuth();

    return (
        <DogsContextProvider>
            <Routes>
            <Route element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/default" element={<UnAuthenticated />} />
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
        </DogsContextProvider>
    );
}

export default App;
