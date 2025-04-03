import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // You can reuse your Sidebar.css or create a GovernmentSidebar.css if needed
import logoImage from '../assets/loginImage.png';

const GovernmentSidebar = ({ isOpen, toggleSidebar }) => {
    const menuItems = [

        { icon: 'reports.svg', label: 'Reports & Suggestions', path: '/gov-reports' },
        { icon: 'announcements.svg', label: 'Announcements', path: '/gov-announcements' },
        { icon: 'channels.svg', label: 'Channels', path: '/gov-channels' },
        { icon: 'notifications.svg', label: 'Notifications', path: '/gov-notifications' },
        { icon: 'team.svg', label: 'Team', path: '/gov-team' }
    ];

    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-top">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <img src="/icons/menu.svg" alt="Menu Icon" className="menu-icon" />
                </button>
                <Link to="/government" className="sidebar-logo">
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
                <button className="logout-btn">
                    <img src="/icons/Logout.svg" alt="Logout Icon" className="btn-icon" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default GovernmentSidebar;
