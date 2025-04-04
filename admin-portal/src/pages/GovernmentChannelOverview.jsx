// Inside your GovernmentChannelOverview.jsx (or similar)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import GovernmentChannelPosts from '../components/GovernmentChannelPosts';
import '../styles/GovernmentChannelOverview.css';

const GovernmentChannelOverview = () => {
    const initialChannels = [
        {
            _id: 'channelId123',
            name: 'General Discussion',
            community: 'Mahalapye',
            subscribers: 150,
            lastAnnouncement: '2023-04-15'
        },
        {
            _id: 'channelId456',
            name: 'Announcements',
            community: 'Gaborone',
            subscribers: 80,
            lastAnnouncement: '2023-04-14'
        }
    ];

    const [channels] = useState(initialChannels);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
    };

    return (
        <div className="gov-channel-management-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="gov-channel-management-container">
                <div className="cm-topbar">
                    <Link to="/government" className="cm-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <h2>Channel Overview</h2>
                </div>
                <div className="cm-content">
                    <div className="cm-table-container">
                        <table className="cm-table">
                            <thead>
                            <tr>
                                <th>Channel Name</th>
                                <th>Community</th>
                                <th>Total Subscribers</th>
                                <th>Last Announcement Sent</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {channels.length > 0 ? (
                                channels.map((channel) => (
                                    <tr key={channel._id} onClick={() => handleSelectChannel(channel)}>
                                        <td>{channel.name}</td>
                                        <td>{channel.community}</td>
                                        <td>{channel.subscribers}</td>
                                        <td>{channel.lastAnnouncement}</td>
                                        <td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectChannel(channel);
                                                }}
                                            >
                                                Manage Channel
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No channels available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* Render posts UI when a channel is selected */}
                    {selectedChannel && (
                        <GovernmentChannelPosts channelId={selectedChannel._id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GovernmentChannelOverview;
