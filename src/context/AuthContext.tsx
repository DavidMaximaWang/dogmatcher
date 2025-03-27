// src/contexts/AuthContext.tsx
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; // your Firebase config
import { useQueryClient, Query } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event?.type === 'updated' && (event.query as Query)?.state?.status === 'error') {
                const error = (event.query as Query)?.state?.error as AxiosError;
                if (error?.response?.status === 401) {
                    queryClient.clear();
                    navigate('/login');
                }
            }
        });
        return () => unsubscribe();
    }, [navigate, queryClient]);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        // setUser is auto-handled by onAuthStateChanged
    };

    const register = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
      };

    const logout = async () => {
        await signOut(auth);
        setUser(null); // optional: immediate update
    };

    return <AuthContext.Provider value={{ user, login, register,logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
