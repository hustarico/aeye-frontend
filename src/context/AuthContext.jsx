import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token or check validity if needed. 
            // For now, assuming token implies auth, but we might want to fetch user details.
            // Since the prompt doesn't specify a "me" endpoint, we might rely on initial login data
            // or decode JWT. For simplicity as per prompt, we just store token.
            // Ideally, we'd decode the JWT to get roles here if not stored separately.

            // Let's assume we decode the token or have stored user info. 
            // If prompt implies just storing token, we might need to rely on decoding it 
            // or fetching user roles. The prompt mentions "ROLE_USER", etc.
            // Usually these are in the JWT payload.

            // Mocking user restoration from token or local storage if we stored user there too.
            // Or we can parse the JWT payload (claims).
            // For this implementation, I'll assume we might persist user roles too or decode them.
            // Let's safe-guard by checking if we have user data. 
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // Attempt backend logout
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed on backend", error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
