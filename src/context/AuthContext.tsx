// src/contexts/AuthContext.tsx
import { Query, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

// interface UserWithRole extends User {
//     role?: UserRole;
// }

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    userData: DocumentData | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User| null>(null);
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<DocumentData | undefined>(undefined)

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
    });

    return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get user role from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                const userData = userDoc.data();
                setUserData(userData)
                // setUser({ ...firebaseUser, role: userData?.role || 'user' });
            } /* else {
                // setUser(null);
            } */
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
        await setDoc(doc(db, 'users', userCredential.user.uid), { role: 'user', email });
    };

    const logout = async () => {
        await signOut(auth);
        // setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, userData }}>
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
