import axiosInstance from "./axios";

class AuthService {
    private static instance: AuthService;
    private isAuthenticating = false;
    private constructor() {}

    public isUserAuthenticated() {
        return this.isAuthenticating;
    }
    public static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(email: string, name: string) {
        try{
            const response = await axiosInstance.post('/auth/login', { email, name });
            this.isAuthenticating = true;
        } catch (error) {
            console.error(error);
        }

    }
    public async logout() {
        try {
            const response = await axiosInstance.post('/logout');
            this.isAuthenticating = false;
        } catch (error) {
            console.error(error);
        }
    }
}

export default AuthService.getInstance();