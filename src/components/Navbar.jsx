import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, token } = useAuth();

    if (!token) return null; // Or show a public navbar? Prompt says "Login/Register: Public" implied no navbar or different one. 
    // "Navbar: Left side: Placeholder Logo. Right side: Links... and a Logout button."
    // Usually Navbar is visible when logged in. Let's assume hidden on Login page if we want, or visible but limited.
    // Prompt says "Links to Feed, Analytics (if Manager), Admin (if Admin)..." which implies authenticated state.

    // Updated logic: direct check on user.role string

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="logo-placeholder">Aeye CCTV</div>
            </div>
            <div className="navbar-right">
                <Link to="/feed" className="nav-link">Feed</Link>
                {(user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN') && (
                    <Link to="/analytics" className="nav-link">Analytics</Link>
                )}
                {user?.role === 'ROLE_ADMIN' && (
                    <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
