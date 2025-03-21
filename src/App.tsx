import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import About from './pages/About';
import Layout from './components/Layout';
import DogDetailsPage from './components/DogDetailsPage';
import DogsContextProvider from './context/DogsContextProvider';

function App() {
    const { user } = useAuth();

    return (
        <>
            {!user ? (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                <DogsContextProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/dogs/:id" element={<DogDetailsPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </DogsContextProvider>
            )}
        </>
    );
}

export default App;