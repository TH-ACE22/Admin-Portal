// src/components/GovernmentSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css'; // or a dedicated GovernmentSidebar.css
import logoImage from '../assets/loginImage.png';

const GovernmentSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: 'reports.svg', label: 'Reports & Suggestions', path: '/gov-reports' },
        { icon: 'announcements.svg', label: 'Announcements',      path: '/gov-announcements' },
        { icon: 'channels.svg',      label: 'Channels',           path: '/gov-channels' },
        { icon: 'notification.svg',  label: 'Notifications',      path: '/gov-notifications' },
        { icon: 'team.svg',          label: 'Team',               path: '/gov-team' }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-top">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <img src="/icons/menu.svg" alt="Toggle Menu" className="menu-icon" />
                </button>
                <NavLink to="/government-dashboard" className="sidebar-logo">
                    <img src={logoImage} alt="Logo" className="logo-image" />
                    {isOpen && <span className="logo-text">Gov Portal</span>}
                </NavLink>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map(({ icon, label, path }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `sidebar-btn${isActive ? ' active' : ''}`
                                }
                            >
                                <img src={`/icons/${icon}`} alt={label} className="btn-icon" />
                                {isOpen && <span className="btn-label">{label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-bottom">
                <button className="logout-btn" onClick={handleLogout}>
                    <img src="/icons/Logout.svg" alt="Logout" className="btn-icon" />
                    {isOpen && <span className="btn-label">Log Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default GovernmentSidebar;
