import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import '../styles/UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filterCommunity, setFilterCommunity] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await axios.get(`${API_BASE}/users/getAll`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, [API_BASE]);

    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const openSuspendModal = (user) => {
        setSelectedUser(user);
        setIsSuspendModalOpen(true);
    };

    const openActivityModal = (user) => {
        setSelectedUser(user);
        setIsActivityModalOpen(true);
    };

    const closeSuspendModal = () => {
        setIsSuspendModalOpen(false);
        setSelectedUser(null);
    };

    const closeActivityModal = () => {
        setIsActivityModalOpen(false);
        setSelectedUser(null);
    };

    const confirmSuspend = async (userId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`${API_BASE}/users/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(user => user.id === userId ? { ...user, status: 'Suspended' } : user));
        } catch (err) {
            console.error('Failed to suspend user:', err);
        }
        closeSuspendModal();
    };

    const confirmActivate = async (userId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`${API_BASE}/users/${userId}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(user => user.id === userId ? { ...user, status: 'Active' } : user));
        } catch (err) {
            console.error('Failed to activate user:', err);
        }
        closeSuspendModal();
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`${API_BASE}/users/${userId}/role`, newRole, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    const filteredUsers = users.filter(user => {
        if (filterCommunity === 'All') return true;
        return user.community === filterCommunity;
    });

    const allCommunities = ['All', ...new Set(users.map(user => user.community).filter(Boolean))];

    return (
        <div className="user-management-page">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="user-management-container">
                <div className="um-topbar">
                    <Link to="/dashboard" className="um-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <button className="um-menu-btn" onClick={handleToggleSidebar}>
                        <img src="/icons/menu.svg" alt="Toggle Sidebar" />
                    </button>
                    <h2>User Management</h2>
                </div>

                <div className="um-content">
                    <div className="um-filter">
                        <label htmlFor="community-filter">Filter by Community:</label>
                        <select
                            id="community-filter"
                            value={filterCommunity}
                            onChange={(e) => setFilterCommunity(e.target.value)}
                        >
                            {allCommunities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="um-table-container">
                        <table className="um-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Community</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Activity</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{`${user.firstName} ${user.lastName}`}</td>
                                        <td>{user.community || '—'}</td>
                                        <td>{user.role}</td>
                                        <td className={user.status === 'Active' ? 'status-active' : 'status-suspended'}>
                                            {user.status}
                                        </td>
                                        <td>{user.lastActivity || '—'}</td>
                                        <td>
                                            {user.role !== 'ROLE_ADMIN' ? (
                                                <button onClick={() =>
                                                    handleRoleChange(
                                                        user.id,
                                                        user.role === 'ROLE_USER' ? 'ROLE_MODERATOR' : 'ROLE_USER'
                                                    )
                                                }>
                                                    Toggle Role
                                                </button>
                                            ) : (
                                                <button disabled title="Admin role cannot be edited">Edit Role</button>
                                            )}
                                            {user.status === 'Suspended' ? (
                                                <button onClick={() => confirmActivate(user.id)}>Activate</button>
                                            ) : (
                                                <button onClick={() => openSuspendModal(user)}>Suspend</button>
                                            )}
                                            <button onClick={() => openActivityModal(user)}>View Activity</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7">No users available</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isSuspendModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{selectedUser.status === 'Suspended' ? 'Activate User' : 'Suspend User'}</h3>
                        <p>
                            Are you sure you want to
                            {selectedUser.status === 'Suspended' ? ' activate ' : ' suspend '}
                            <span className="highlight">{selectedUser.firstName} {selectedUser.lastName}</span>?
                        </p>
                        <div className="modal-actions">
                            {selectedUser.status === 'Suspended' ? (
                                <button onClick={() => confirmActivate(selectedUser.id)}>Yes, Activate</button>
                            ) : (
                                <button onClick={() => confirmSuspend(selectedUser.id)}>Yes, Suspend</button>
                            )}
                            <button onClick={closeSuspendModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isActivityModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>User Activity</h3>
                        <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p><strong>Community:</strong> {selectedUser.community || '—'}</p>
                        <p><strong>Last Activity:</strong> {selectedUser.lastActivity || '—'}</p>
                        <div className="modal-actions">
                            <button onClick={closeActivityModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
