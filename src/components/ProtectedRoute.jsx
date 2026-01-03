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
        // Check if user has at least one of the required roles
        // Assuming user.roles is an array of strings like ['ROLE_USER', 'ROLE_ADMIN']
        // Verify structure with backend ref later if needed.
        const hasRole = roles.some(role => user.roles?.includes(role));
        if (!hasRole) {
            // Redirect to feed if authorized but not for this role, or login
            return <Navigate to="/feed" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
