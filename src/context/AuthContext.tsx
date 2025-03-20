import { createContext, ReactNode, useContext, useState } from "react";
import AuthService from "../services/auth";

interface AuthContextType {
    user: boolean;
    login: (email: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<boolean>(false);

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
