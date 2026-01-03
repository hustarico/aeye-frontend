import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/v1/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            // Mock data for display if backend is empty/failing during dev
            // setUsers([{ id: 1, username: 'test_user', roles: ['ROLE_USER'] }, { id: 2, username: 'manager', roles: ['ROLE_MANAGER'] }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/api/v1/admin/users/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleEdit = (user) => {
        // For now, just logging or alert as requirements don't specify full edit form.
        const newRole = prompt(`Enter new role for ${user.username} (e.g., ROLE_MANAGER):`, user.roles?.[0] || 'ROLE_USER');
        if (newRole) {
            // Implement update logic if endpoint exists, e.g., PUT /api/v1/admin/users/{id}
            console.log("Updating user", user.id, "to role", newRole);
            // Optimistic update
            setUsers(users.map(u => u.id === user.id ? { ...u, roles: [newRole] } : u));
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Roles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.roles && user.roles.join(', ')}</td>
                                    <td>
                                        <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;
