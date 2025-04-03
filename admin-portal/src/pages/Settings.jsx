// src/pages/Settings.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminRoles from '../components/AdminRoles';
import ProfilePreferences from '../components/ProfilePreferences';
import GovernmentServices from '../components/GovernmentServices';
import '../styles/Settings.css';

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [activeTab, setActiveTab] = useState('adminRoles');

    return (
        <div className="settings-page">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="settings-container">
                <div className="settings-topbar">
                    <Link to="/dashboard" className="settings-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <button className="settings-menu-btn" onClick={handleToggleSidebar}>
                        <img src="/icons/menu.svg" alt="Toggle Sidebar" />
                    </button>
                    <h2>Settings</h2>
                </div>

                <div className="settings-tabs">
                    <button
                        className={activeTab === 'adminRoles' ? 'active' : ''}
                        onClick={() => setActiveTab('adminRoles')}
                    >
                        Manage Admin Roles
                    </button>
                    <button
                        className={activeTab === 'preferences' ? 'active' : ''}
                        onClick={() => setActiveTab('preferences')}
                    >
                        Profile & Preferences
                    </button>
                    <button
                        className={activeTab === 'govServices' ? 'active' : ''}
                        onClick={() => setActiveTab('govServices')}
                    >
                        Government Services
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'adminRoles' && <AdminRoles />}
                    {activeTab === 'preferences' && <ProfilePreferences />}
                    {activeTab === 'govServices' && <GovernmentServices />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
