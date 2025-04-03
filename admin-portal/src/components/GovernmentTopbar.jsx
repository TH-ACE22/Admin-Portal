import React from 'react';
import '../styles/GovernmentTopbar.css';

const GovernmentTopbar = ({ toggleSidebar, isSidebarOpen }) => {
    // Dynamically adjust the topbar based on sidebar state:
    const topbarStyle = {
        left: isSidebarOpen ? '250px' : '64px',
        width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 64px)'
    };

    return (
        <header className="government-topbar" style={topbarStyle}>
            <div className="government-topbar-left">
                <button onClick={toggleSidebar} className="toggle-btn" aria-label="Toggle Sidebar">
                    <img src="/icons/menu.svg" alt="Menu" className="menu-icon" />
                </button>
                <img src="/icons/government-seal.svg" alt="Government Seal" className="government-logo" />
                <h1>National Government Portal</h1>
            </div>
            <div className="government-topbar-middle">
                <input
                    type="search"
                    placeholder="Search government services..."
                    className="search-input"
                />
            </div>
            <div className="government-topbar-right">
                <button className="notification-btn">
                    <img src="/icons/notification.svg" alt="Notification" className="notif-icon" />
                </button>
                <div className="user-info">
                    <span>Hi, Official</span>
                    <img src="/icons/Account.svg" alt="Account" className="account-icon" />
                </div>
            </div>
        </header>
    );
};

export default GovernmentTopbar;
