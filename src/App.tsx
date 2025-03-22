import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import DogDetailsPage from './components/DogDetailsPage';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import DogsContextProvider from './context/DogsContextProvider';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
    const { user } = useAuth();

    return (
        <DogsContextProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                {user ? (
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/dogs/:id" element={<DogDetailsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                ) : (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </DogsContextProvider>
    );
}

export default App;
