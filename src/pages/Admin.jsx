import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/v1/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/v1/admin/users/${selectedUser.id}`);
            setUsers(users.filter(user => user.id !== selectedUser.id));
            showNotification('User deleted successfully', 'success');
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete user", error);
            showNotification('Failed to delete user', 'error');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        const currentRole = user.role || user.roles?.[0] || 'ROLE_USER';
        const currentRoleShort = currentRole.replace('ROLE_', '');
        setSelectedRole(currentRoleShort);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setSelectedRole('');
    };

    const handleRoleUpdate = async () => {
        if (!selectedRole) {
            showNotification('Please select a role', 'error');
            return;
        }

        try {
            await api.put(`/api/v1/admin/users/${selectedUser.id}/role`, {
                roleName: selectedRole
            });

            fetchUsers();
            closeModal();
            showNotification('Role updated successfully', 'success');
        } catch (error) {
            console.error("Failed to update role", error);
            showNotification('Failed to update role', 'error');
        }
    };

    const displayRole = (user) => {
        if (user.role) {
            return user.role;
        } else if (user.roles && user.roles.length > 0) {
            return user.roles.join(', ');
        }
        return 'N/A';
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{displayRole(user)}</td>
                                    <td>
                                        <button className="action-btn edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                                        <button className="action-btn delete-btn" onClick={() => openDeleteModal(user)}>Delete</button>
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

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit User Role</h2>
                        <p className="modal-username">User: <strong>{selectedUser?.username}</strong></p>

                        <div className="form-group">
                            <label htmlFor="role-select">Select Role:</label>
                            <select
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="role-select"
                            >
                                <option value="USER">USER</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn cancel-btn" onClick={closeModal}>Cancel</button>
                            <button className="modal-btn save-btn" onClick={handleRoleUpdate}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Confirm Delete</h2>
                        <p className="modal-username">
                            Are you sure you want to delete user <strong>{selectedUser?.username}</strong>?
                        </p>
                        <p style={{ color: 'var(--accent-color-red)', fontSize: '0.9rem', marginTop: '1rem' }}>
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <button className="modal-btn cancel-btn" onClick={closeDeleteModal}>Cancel</button>
                            <button className="modal-btn delete-confirm-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
