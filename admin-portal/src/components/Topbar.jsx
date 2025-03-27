// src/components/Topbar.jsx
import React from 'react';
import '../styles/Topbar.css';

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Toggle button can also exist here, letting the user open/close the sidebar */}
    
        <h1>Dashboard</h1>
      </div>
      <div className="topbar-middle">
        <input
          type="search"
          placeholder="Type to search..."
          className="search-input"
        />
      </div>
      <div className="topbar-right">
        <button className="notification-btn">
          <img src="/icons/notification.svg" alt="Notification" className="notif-icon" />
        </button>
        <div className="user-info">
          <span>Hi, Username</span>
          <img src="/icons/Account.svg" alt="Account" className="account-icon" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
