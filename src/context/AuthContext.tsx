// src/contexts/AuthContext.tsx
import { Query, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

interface UserWithRole extends User {
    role?: UserRole;
}

interface AuthContextType {
    user: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserWithRole | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get user role from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                const userData = userDoc.data();
                setUser({ ...firebaseUser, role: userData?.role || 'user' });
            } else {
                setUser(null);
            }
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
    };

    const register = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set default role as 'user' in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), { role: 'user' });
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
