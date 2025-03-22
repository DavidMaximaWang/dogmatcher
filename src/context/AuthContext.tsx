import { Query, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

interface AuthContextType {
    user: boolean;
    login: (email: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<boolean>(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event?.type === 'updated' && (event.query as Query)?.state?.status === 'error') {
                const error = (event.query as Query)?.state?.error as AxiosError;
                if (error) {
                    queryClient.clear();
                    navigate('/login');
                }
                if (error?.response?.status === 401 /*  && !hasRedirected */) {
                    console.error('Unauthorized - Redirecting to login...');
                    queryClient.clear();
                    navigate('/login');
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate, queryClient]);

    const login = async (email: string, name: string) => {
        const success = await AuthService.login(email, name);

        if (success) {
            setUser(true);
        }
    };

    const logout = async () => {
        const success = await AuthService.logout();
        if (success) {
            setUser(false);
        }
    };
    // throw new Error();

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
