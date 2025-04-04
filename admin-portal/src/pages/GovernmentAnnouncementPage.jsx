// src/pages/GovernmentAnnouncementPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import '../styles/GovernmentAnnouncementPage.css';

const GovernmentAnnouncementPage = () => {
    // Sample announcement data
    const initialAnnouncements = [
        {
            id: 'ann1',
            title: 'New Feature Release',
            content: 'We are excited to introduce new features today!',
            status: 'Active',
            timestamp: '2023-05-01T10:00:00Z',
            reactions: { likes: 10, dislikes: 2 },
            alertType: 'Info'
        },
        {
            id: 'ann2',
            title: 'Scheduled Maintenance',
            content: 'Maintenance is scheduled for 2023-05-05. Expect downtime.',
            status: 'Scheduled',
            timestamp: '2023-05-03T09:00:00Z',
            reactions: { likes: 5, dislikes: 0 },
            alertType: 'Warning'
        },
        {
            id: 'ann3',
            title: 'Old Announcement',
            content: 'This announcement has now expired.',
            status: 'Expired',
            timestamp: '2023-04-20T15:30:00Z',
            reactions: { likes: 8, dislikes: 1 },
            alertType: 'Info'
        }
    ];

    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [selectedTab, setSelectedTab] = useState('Active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        status: 'Active'
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

    const filteredAnnouncements = announcements.filter(
        (ann) => ann.status === selectedTab
    );

    const handleCreateAnnouncement = () => {
        const newAnn = {
            id: `ann-${Date.now()}`,
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            status: newAnnouncement.status,
            timestamp: new Date().toISOString(),
            reactions: { likes: 0, dislikes: 0 },
            alertType: 'Info'
        };
        setAnnouncements([newAnn, ...announcements]);
        setNewAnnouncement({ title: '', content: '', status: 'Active' });
        setIsModalOpen(false);
    };

    return (
        <div className="gov-announcement-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="gov-announcement-container">
                <div className="ga-topbar">
                    <Link to="/government" className="ga-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <h2>Announcements</h2>
                </div>
                <div className="ga-content">
                    <div className="ac-header">
                        <h3>List of Latest Announcements</h3>
                        <button className="new-announcement-btn" onClick={() => setIsModalOpen(true)}>
                            New Announcement
                        </button>
                    </div>
                    <div className="ac-tabs">
                        {['Active', 'Scheduled', 'Expired'].map((tab) => (
                            <button
                                key={tab}
                                className={`ac-tab ${selectedTab === tab ? 'active' : ''}`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="ac-list">
                        {filteredAnnouncements.length > 0 ? (
                            filteredAnnouncements.map((ann) => (
                                <div key={ann.id} className="ac-item">
                                    <h4>{ann.title}</h4>
                                    <p>{ann.content}</p>
                                    <div className="ac-meta">
                                        <span>{new Date(ann.timestamp).toLocaleString()}</span>
                                        <span>
                      Reactions: 👍 {ann.reactions.likes} 👎 {ann.reactions.dislikes}
                    </span>
                                        <span>Alert: {ann.alertType}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No announcements available.</p>
                        )}
                    </div>

                    {isModalOpen && (
                        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <h3>Create New Announcement</h3>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newAnnouncement.title}
                                    onChange={(e) =>
                                        setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                                    }
                                />
                                <textarea
                                    placeholder="Content"
                                    value={newAnnouncement.content}
                                    onChange={(e) =>
                                        setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                                    }
                                ></textarea>
                                <select
                                    value={newAnnouncement.status}
                                    onChange={(e) =>
                                        setNewAnnouncement({ ...newAnnouncement, status: e.target.value })
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Expired">Expired</option>
                                </select>
                                <div className="modal-actions">
                                    <button onClick={handleCreateAnnouncement}>Post Announcement</button>
                                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GovernmentAnnouncementPage;
