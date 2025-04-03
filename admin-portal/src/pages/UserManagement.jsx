// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/UserManagement.css';

const UserManagement = () => {
    // Sample user data for demonstration
    const initialUsers = [
        {
            _id: 'user123',
            name: 'Alice Smith',
            community: 'Mahalapye',
            role: 'Admin',
            status: 'Active',
            lastActivity: '2023-03-25 10:15'
        },
        {
            _id: 'user456',
            name: 'Bob Johnson',
            community: 'Gaborone',
            role: 'User',
            status: 'Suspended',
            lastActivity: '2023-03-24 09:00'
        },
        {
            _id: 'user789',
            name: 'Charlie Brown',
            community: 'Mahalapye',
            role: 'User',
            status: 'Active',
            lastActivity: '2023-03-25 12:30'
        }
    ];

    const [users, setUsers] = useState(initialUsers);
    const [filterCommunity, setFilterCommunity] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Modal states
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Filter users by community
    const filteredUsers = users.filter(user => {
        if (filterCommunity === 'All') return true;
        return user.community === filterCommunity;
    });

    // Open modals
    const openSuspendModal = (user) => {
        setSelectedUser(user);
        setIsSuspendModalOpen(true);
    };

    const openActivityModal = (user) => {
        setSelectedUser(user);
        setIsActivityModalOpen(true);
    };

    // Close modals
    const closeSuspendModal = () => {
        setIsSuspendModalOpen(false);
        setSelectedUser(null);
    };

    const closeActivityModal = () => {
        setIsActivityModalOpen(false);
        setSelectedUser(null);
    };

    // Confirm suspend action
    const confirmSuspend = (userId) => {
        setUsers(users.map(user =>
            user._id === userId ? { ...user, status: 'Suspended' } : user
        ));
        closeSuspendModal();
    };

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
                            <option value="All">All</option>
                            <option value="Mahalapye">Mahalapye</option>
                            <option value="Gaborone">Gaborone</option>
                        </select>
                    </div>

                    <div className="um-table-container">
                        <table className="um-table">
                            <thead>
                            <tr>
                                <th>_id</th>
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
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.community}</td>
                                        <td>{user.role}</td>
                                        <td className={user.status === 'Active' ? 'status-active' : 'status-suspended'}>
                                            {user.status}
                                        </td>
                                        <td>{user.lastActivity}</td>
                                        <td>
                                            {user.role !== 'Admin' ? (
                                                <button onClick={() => alert(`Edit role for user ${user._id}`)}>
                                                    Edit Role
                                                </button>
                                            ) : (
                                                <button disabled title="Admin role cannot be edited">
                                                    Edit Role
                                                </button>
                                            )}
                                            <button onClick={() => openSuspendModal(user)}>
                                                Suspend
                                            </button>
                                            <button onClick={() => openActivityModal(user)}>
                                                View Activity
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No users available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Suspend Modal */}
            {isSuspendModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Suspend User</h3>
                        <p>
                            Are you sure you want to suspend <span className="highlight">{selectedUser.name}</span>?
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => confirmSuspend(selectedUser._id)}>Yes, Suspend</button>
                            <button onClick={closeSuspendModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {isActivityModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>User Activity</h3>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Community:</strong> {selectedUser.community}</p>
                        <p><strong>Last Activity:</strong> {selectedUser.lastActivity}</p>
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
