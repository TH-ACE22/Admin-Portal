// src/pages/GovernmentNotificationPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import '../styles/GovernmentNotificationPage.css';

const GovernmentNotificationPage = () => {
    // Sample notification data
    const initialNotifications = [
        {
            id: 'notif1',
            channelId: 'channelId123',
            message: 'Your query regarding the service has been resolved.',
            queryId: 'query789',
            sentBy: 'Admin'
        },
        {
            id: 'notif2',
            channelId: 'channelId456',
            message: 'A new announcement has been posted in your channel.',
            queryId: '',
            sentBy: 'System'
        }
    ];

    const [notifications] = useState(initialNotifications);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="gov-notification-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="gov-notification-container">
                <div className="gn-topbar">
                    <Link to="/government" className="gn-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <h2>Notifications</h2>
                </div>
                <div className="gn-content">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className="notification-item">
                                <p className="notif-message">{notif.message}</p>
                                <div className="notif-meta">
                                    <span>Channel: {notif.channelId}</span>
                                    {notif.queryId && <span>Query: {notif.queryId}</span>}
                                    <span>Sent by: {notif.sentBy}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GovernmentNotificationPage;
