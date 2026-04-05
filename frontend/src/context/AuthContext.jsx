import { createContext, useContext, useState, useCallback } from 'react';
import api, { setAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // isAuth is purely in-memory — no localStorage persistence for security
    const [isAuth, setIsAuth] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const login = useCallback(async (username, password) => {
        setAuthLoading(true);
        setAuthError('');
        try {
            const response = await api.post('/auth/login/', { username, password });
            const { access } = response.data;

            // Store access token in memory only — never in localStorage
            setAccessToken(access);
            setIsAuth(true);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.detail || 'Invalid credentials. Please try again.';
            setAuthError(msg);
            return { success: false, error: msg };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            // Blacklist the refresh token on the server
            await api.post('/auth/logout/', {});
        } catch {
            // Ignore — still clear local state
        }
        clearAccessToken();
        setIsAuth(false);
        setAuthError('');
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, login, logout, authError, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
