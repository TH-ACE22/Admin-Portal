// src/pages/AnnouncementsNotifications.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AnnouncementsNotifications.css';

const AnnouncementsNotifications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Announcements state
    const [announcementTarget, setAnnouncementTarget] = useState('All');
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementHistory, setAnnouncementHistory] = useState([]);

    // Notifications state
    const [notificationText, setNotificationText] = useState('');
    const [notificationLog, setNotificationLog] = useState([]);

    // Modal states
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Announcement actions
    const handleAddAnnouncement = () => {
        setIsAnnouncementModalOpen(true);
    };

    const handleSendAnnouncement = () => {
        const newAnnouncement = {
            id: new Date().getTime().toString(),
            target: announcementTarget,
            text: announcementText,
            date: new Date().toLocaleString(),
        };
        setAnnouncementHistory([newAnnouncement, ...announcementHistory]);
        setAnnouncementText('');
        setAnnouncementTarget('All');
        setIsAnnouncementModalOpen(false);
        alert('Announcement sent!');
    };

    // Notification actions
    const handleAddNotification = () => {
        setIsNotificationModalOpen(true);
    };

    const handleSendNotification = () => {
        const newNotification = {
            id: new Date().getTime().toString(),
            text: notificationText,
            date: new Date().toLocaleString(),
        };
        setNotificationLog([newNotification, ...notificationLog]);
        setNotificationText('');
        setIsNotificationModalOpen(false);
        alert('Notification sent!');
    };

    return (
        <div className="announcements-notifications-page">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="announcements-notifications-container">
                <div className="an-topbar">
                    <Link to="/dashboard" className="an-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <button className="an-menu-btn" onClick={handleToggleSidebar}>
                        <img src="/icons/menu.svg" alt="Toggle Sidebar" />
                    </button>
                    <h2>Announcements & Notifications</h2>
                </div>

                <div className="an-content">
                    {/* Announcements Section */}
                    <div className="section announcements-section">
                        <div className="section-header">
                            <h3>Announcements</h3>
                            <button onClick={handleAddAnnouncement}>Add Announcement</button>
                        </div>
                        <div className="table-container">
                            <table className="rs-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Target</th>
                                    <th>Text</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {announcementHistory.length > 0 ? (
                                    announcementHistory.map((announcement) => (
                                        <tr key={announcement.id}>
                                            <td>{announcement.id}</td>
                                            <td>{announcement.target}</td>
                                            <td>{announcement.text}</td>
                                            <td>{announcement.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No announcements sent yet.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="section notifications-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <button onClick={handleAddNotification}>Add Notification</button>
                        </div>
                        <div className="table-container">
                            <table className="rs-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Text</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {notificationLog.length > 0 ? (
                                    notificationLog.map((notification) => (
                                        <tr key={notification.id}>
                                            <td>{notification.id}</td>
                                            <td>{notification.text}</td>
                                            <td>{notification.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No notifications sent yet.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>New Announcement</h3>
                        <div className="modal-form">
                            <label htmlFor="announcement-target">Send to:</label>
                            <select
                                id="announcement-target"
                                value={announcementTarget}
                                onChange={(e) => setAnnouncementTarget(e.target.value)}
                            >
                                <option value="All">All Users</option>
                                <option value="Community">Specific Community</option>
                                <option value="Channel">Specific Channel</option>
                            </select>
                            <label htmlFor="announcement-text">Announcement Text:</label>
                            <textarea
                                id="announcement-text"
                                name="announcement-text"
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                                placeholder="Type your announcement here..."
                            ></textarea>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSendAnnouncement}>Send Announcement</button>
                            <button onClick={() => setIsAnnouncementModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {isNotificationModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>New Notification</h3>
                        <div className="modal-form">
                            <label htmlFor="notification-text">Notification Text:</label>
                            <textarea
                                id="notification-text"
                                name="notification-text"
                                value={notificationText}
                                onChange={(e) => setNotificationText(e.target.value)}
                                placeholder="Type your notification here..."
                            ></textarea>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSendNotification}>Send Notification</button>
                            <button onClick={() => setIsNotificationModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsNotifications;
