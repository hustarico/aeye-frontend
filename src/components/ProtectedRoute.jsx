import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
    const { token, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && user) {
        // user.role is a string like "ROLE_USER" or "ROLE_MANAGER"
        const hasRole = roles.includes(user.role);
        if (!hasRole) {
            return <Navigate to="/feed" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
