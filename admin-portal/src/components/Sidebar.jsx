import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/Sidebar.css';
import logoImage from '../assets/loginImage.png'; // Adjust path if needed

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
      </div>

      <div className="sidebar-logo">
        {/* Use Link to redirect to /dashboard when logo is clicked */}
        <Link to="/dashboard">
  <img src={logoImage} alt="Logo" className="logo-image" />
</Link>

      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* 
                Optionally, use NavLink for active styling:
                <NavLink to={item.path} className="sidebar-btn"> 
                  ...
                </NavLink>
              */}
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

export default Sidebar;
