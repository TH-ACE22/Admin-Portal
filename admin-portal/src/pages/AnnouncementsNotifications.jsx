import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AnnouncementsNotifications.css';

const AnnouncementsNotifications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Announcements state
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementHistory, setAnnouncementHistory] = useState([]);

    // Notifications state
    const [notificationText, setNotificationText] = useState('');
    const [notificationLog, setNotificationLog] = useState([]);

    // Community & Channel
    const [communities, setCommunities] = useState([]);
    const [communityMap, setCommunityMap] = useState({});
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [channels, setChannels] = useState([]);
    const [channelMap, setChannelMap] = useState({});
    const [selectedChannel, setSelectedChannel] = useState('');

    // Modal visibility
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

    // Search & Pagination
    const [searchAnnouncements, setSearchAnnouncements] = useState('');
    const [announcePage, setAnnouncePage] = useState(1);
    const [searchNotifications, setSearchNotifications] = useState('');
    const [notifPage, setNotifPage] = useState(1);
    const PER_PAGE = 5;

    const stompClientRef = useRef(null);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    // Initialize STOMP
    useEffect(() => {
        const socket = new SockJS(`${API_BASE}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: msg => console.debug(msg),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/topic/announcements', ({ body }) => {
                    const ann = JSON.parse(body);
                    setAnnouncementHistory(prev => [ann, ...prev]);
                    toast.success('New announcement received');
                });
                client.subscribe('/user/queue/notifications', ({ body }) => {
                    const notif = JSON.parse(body);
                    setNotificationLog(prev => [notif, ...prev]);
                    toast.success('New notification received');
                });
            },
            onStompError: frame => {
                toast.error(`STOMP error: ${frame.headers['message']}`);
            }
        });
        client.activate();
        stompClientRef.current = client;
        return () => client.deactivate();
    }, [API_BASE]);

    // Load communities
    useEffect(() => {
        axios.get(`${API_BASE}/communities`)
            .then(res => {
                setCommunities(res.data);
                const map = {};
                res.data.forEach(c => { map[c.id] = c.name; });
                setCommunityMap(map);
            })
            .catch(() => toast.error('Failed to load communities'));
    }, [API_BASE]);

    // Load channels on community change
    useEffect(() => {
        if (selectedCommunity) {
            axios.get(`${API_BASE}/communities/${selectedCommunity}/channels`)
                .then(res => {
                    setChannels(res.data);
                    setChannelMap(prev => {
                        const map = { ...prev };
                        res.data.forEach(ch => { map[ch.id] = ch.name; });
                        return map;
                    });
                })
                .catch(() => toast.error('Failed to load channels'));
        } else {
            setChannels([]);
        }
        setSelectedChannel('');
    }, [selectedCommunity, API_BASE]);

    // Handlers
    const handleToggleSidebar = () => setSidebarOpen(v => !v);

    const handleSendAnnouncement = () => {
        const ann = {
            id: Date.now().toString(),
            communityId: selectedCommunity,
            channelId: selectedChannel,
            text: announcementText,
            date: new Date().toLocaleString(),
        };
        try {
            stompClientRef.current.publish({ destination: '/app/announce', body: JSON.stringify(ann) });
            setAnnouncementHistory(prev => [ann, ...prev]);
            toast.success('Announcement sent');
        } catch {
            toast.error('Failed to send announcement');
        }
        setAnnouncementText(''); setSelectedCommunity(''); setSelectedChannel('');
        setIsAnnouncementModalOpen(false);
    };

    const handleSendNotification = () => {
        const notif = {
            id: Date.now().toString(),
            communityId: selectedCommunity,
            channelId: selectedChannel,
            text: notificationText,
            date: new Date().toLocaleString(),
        };
        try {
            stompClientRef.current.publish({ destination: '/app/notify', body: JSON.stringify(notif) });
            setNotificationLog(prev => [notif, ...prev]);
            toast.success('Notification sent');
        } catch {
            toast.error('Failed to send notification');
        }
        setNotificationText(''); setSelectedCommunity(''); setSelectedChannel('');
        setIsNotificationModalOpen(false);
    };

    // Filter & paginate
    const filteredAnnouncements = announcementHistory.filter(a => {
        const term = searchAnnouncements.toLowerCase();
        return (
            communityMap[a.communityId]?.toLowerCase().includes(term) ||
            channelMap[a.channelId]?.toLowerCase().includes(term) ||
            a.text.toLowerCase().includes(term)
        );
    });
    const announcePages = Math.ceil(filteredAnnouncements.length / PER_PAGE);
    const currentAnnouncements = filteredAnnouncements.slice((announcePage - 1) * PER_PAGE, announcePage * PER_PAGE);

    const filteredNotifications = notificationLog.filter(n => {
        const term = searchNotifications.toLowerCase();
        return (
            communityMap[n.communityId]?.toLowerCase().includes(term) ||
            channelMap[n.channelId]?.toLowerCase().includes(term) ||
            n.text.toLowerCase().includes(term)
        );
    });
    const notifPages = Math.ceil(filteredNotifications.length / PER_PAGE);
    const currentNotifications = filteredNotifications.slice((notifPage - 1) * PER_PAGE, notifPage * PER_PAGE);

    return (
        <div className="announcements-notifications-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="announcements-notifications-container">
                <div className="an-topbar">
                    <Link to="/dashboard" className="an-home-btn"><img src="/icons/home.svg" alt="Home" /></Link>
                    <button className="an-menu-btn" onClick={handleToggleSidebar}><img src="/icons/menu.svg" alt="Menu" /></button>
                    <h2>Announcements & Notifications</h2>
                </div>
                <div className="an-content">
                    {/* Announcements Section */}
                    <div className="section announcements-section">
                        <div className="section-header">
                            <h3>Announcements</h3>
                            <button onClick={() => setIsAnnouncementModalOpen(true)}>Add Announcement</button>
                        </div>
                        <div className="filter-controls">
                            <input
                                type="text"
                                placeholder="Search community/channel/text..."
                                value={searchAnnouncements}
                                onChange={e => { setSearchAnnouncements(e.target.value); setAnnouncePage(1); }}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="rs-table">
                                <thead>
                                <tr><th>ID</th><th>Community</th><th>Channel</th><th>Text</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                {currentAnnouncements.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{communityMap[a.communityId] || '—'}</td>
                                        <td>{channelMap[a.channelId] || '—'}</td>
                                        <td>{a.text}</td>
                                        <td>{a.date}</td>
                                    </tr>
                                ))}
                                {!currentAnnouncements.length && <tr><td colSpan={5}>No announcements found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {announcePages > 1 && (
                            <div className="pagination">
                                <button disabled={announcePage===1} onClick={() => setAnnouncePage(p => p-1)}>Prev</button>
                                <span>{announcePage}/{announcePages}</span>
                                <button disabled={announcePage===announcePages} onClick={() => setAnnouncePage(p => p+1)}>Next</button>
                            </div>
                        )}
                    </div>
                    {/* Notifications Section */}
                    <div className="section notifications-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <button onClick={() => setIsNotificationModalOpen(true)}>Add Notification</button>
                        </div>
                        <div className="filter-controls">
                            <input
                                type="text"
                                placeholder="Search community/channel/text..."
                                value={searchNotifications}
                                onChange={e => { setSearchNotifications(e.target.value); setNotifPage(1); }}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="rs-table">
                                <thead>
                                <tr><th>ID</th><th>Community</th><th>Channel</th><th>Text</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                {currentNotifications.map(n => (
                                    <tr key={n.id}>
                                        <td>{n.id}</td>
                                        <td>{communityMap[n.communityId] || '—'}</td>
                                        <td>{channelMap[n.channelId] || '—'}</td>
                                        <td>{n.text}</td>
                                        <td>{n.date}</td>
                                    </tr>
                                ))}
                                {!currentNotifications.length && <tr><td colSpan={5}>No notifications found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {notifPages > 1 && (
                            <div className="pagination">
                                <button disabled={notifPage===1} onClick={() => setNotifPage(p => p-1)}>Prev</button>
                                <span>{notifPage}/{notifPages}</span>
                                <button disabled={notifPage===notifPages} onClick={() => setNotifPage(p => p+1)}>Next</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>New Announcement</h3>
                        <div className="modal-form">
                            <label>Community:</label>
                            <select value={selectedCommunity} onChange={e => setSelectedCommunity(e.target.value)}>
                                <option value="">-- choose community --</option>
                                {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <label>Channel:</label>
                            <select
                                value={selectedChannel}
                                onChange={e => setSelectedChannel(e.target.value)}
                                disabled={!selectedCommunity}
                            >
                                <option value="">-- choose channel --</option>
                                {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                            </select>
                            <label>Text:</label>
                            <textarea
                                value={announcementText}
                                onChange={e => setAnnouncementText(e.target.value)}
                                placeholder="Type announcement..."
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={handleSendAnnouncement}
                                disabled={!selectedCommunity || !selectedChannel || !announcementText.trim()}
                            >Send</button>
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
                            <label>Community:</label>
                            <select value={selectedCommunity} onChange={e => setSelectedCommunity(e.target.value)}>
                                <option value="">-- choose community --</option>
                                {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <label>Channel:</label>
                            <select
                                value={selectedChannel}
                                onChange={e => setSelectedChannel(e.target.value)}
                                disabled={!selectedCommunity}
                            >
                                <option value="">-- choose channel --</option>
                                {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                            </select>
                            <label>Text:</label>
                            <textarea
                                value={notificationText}
                                onChange={e => setNotificationText(e.target.value)}
                                placeholder="Type notification..."
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={handleSendNotification}
                                disabled={!selectedCommunity || !selectedChannel || !notificationText.trim()}
                            >Send</button>
                            <button onClick={() => setIsNotificationModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsNotifications;
