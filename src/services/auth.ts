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
            await axiosInstance.post('/auth/login', { email, name });
            this.isAuthenticating = true;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }

    }
    public async logout() {
        try {
            await axiosInstance.post('/auth/logout');
            this.isAuthenticating = false;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default AuthService.getInstance();