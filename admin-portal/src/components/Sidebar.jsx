import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import logoImage from '../assets/loginImage.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    // Clear all stored user data and redirect to login
    const handleLogout = () => {
        // Remove authentication tokens and user info
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('keycloakUserId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('fullName');
        localStorage.removeItem('appRole');
        // Optionally clear all keys:
        // localStorage.clear();

        navigate('/login');
    };

    const menuItems = [
        { icon: 'Crowd.svg', label: 'Community Management', path: '/community-management' },
        { icon: 'channel-management.svg', label: 'Channel Management', path: '/channel-management' },
        { icon: 'query-reports.svg', label: 'Reports & Suggestions', path: '/reports' },
        { icon: 'announcements.svg', label: 'Announcements & Notifications', path: '/announcements' },
        { icon: 'user-management.svg', label: 'User Management', path: '/user-management' },
        { icon: 'Settings.svg', label: 'Settings', path: '/settings' }
    ];

    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-top">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <img src="/icons/menu.svg" alt="Menu Icon" className="menu-icon" />
                </button>
                <Link to="/admin-dashboard" className="sidebar-logo">
                    <img src={logoImage} alt="Logo" className="logo-image" />
                </Link>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path} className="sidebar-btn">
                                <img src={`/icons/${item.icon}`} alt={item.label} className="btn-icon" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-bottom">
                <button className="logout-btn" onClick={handleLogout}>
                    <img src="/icons/Logout.svg" alt="Logout Icon" className="btn-icon" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
