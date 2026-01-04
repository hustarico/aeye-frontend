import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const decodeAndSetUser = (currentToken) => {
        try {
            const decodedPromise = jwtDecode(currentToken);
            // Assuming the JWT structure has 'sub' for username and 'role' for role
            // Prompt says: "role": "ROLE_{rolename}"
            setUser({
                username: decodedPromise.sub || 'User', // Fallback
                role: decodedPromise.role || 'ROLE_USER'
            });
        } catch (error) {
            console.error("Invalid token", error);
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        if (token) {
            decodeAndSetUser(token);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // decodeAndSetUser is triggered by useEffect on token change
    };

    const logout = async () => {
        try {
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
