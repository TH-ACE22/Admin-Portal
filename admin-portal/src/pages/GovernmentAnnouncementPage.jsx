// src/pages/GovernmentAnnouncementPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/GovernmentAnnouncementPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const GovernmentAnnouncementPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [allChannels, setAllChannels]     = useState([]);
    const [selectedTab, setSelectedTab]     = useState('Active');
    const [isModalOpen, setIsModalOpen]     = useState(false);
    const [sidebarOpen, setSidebarOpen]     = useState(true);
    const [loading, setLoading]             = useState(true);

    const [newAnnouncement, setNewAnnouncement] = useState({
        channelId: '',
        title: '',
        content: '',
        status: 'Active',
        scheduledAt: '',
        imageUrl: ''
    });

    // lock scroll when modal open
    useEffect(() => {
        document.body.classList.toggle('modal-open', isModalOpen);
    }, [isModalOpen]);

    // initial data fetch: channels + announcements
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Authentication required.');
                setLoading(false);
                return;
            }

            try {
                const [chRes, anRes] = await Promise.all([
                    axios.get(`${API_BASE}/channels`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_BASE}/announcements`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setAllChannels(chRes.data || []);
                setAnnouncements(anRes.data || []);

                // default to first channel if any
                if (chRes.data?.length) {
                    setNewAnnouncement(n => ({ ...n, channelId: chRes.data[0].id }));
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load channels or announcements.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleSidebar = () => setSidebarOpen(v => !v);

    const handleCreate = () => {
        const { channelId, title, content, status, scheduledAt, imageUrl } = newAnnouncement;
        if (!channelId || !title.trim() || !content.trim()) {
            toast.warn('Please choose a channel and fill Title & Content.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        axios.post(`${API_BASE}/announcements`, {
            channelId,
            title,
            content,
            status,
            scheduledAt: scheduledAt || null,
            imageUrl,
            timestamp: new Date().toISOString()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setAnnouncements([res.data, ...announcements]);
                toast.success('Announcement posted!');
                setIsModalOpen(false);
                // reset form
                setNewAnnouncement({
                    channelId: allChannels[0]?.id || '',
                    title: '',
                    content: '',
                    status: 'Active',
                    scheduledAt: '',
                    imageUrl: ''
                });
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to post announcement.');
            });
    };

    const handleImageUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { data } = await axios.post(
                `${API_BASE}/api/v1/images/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setNewAnnouncement(n => ({ ...n, imageUrl: data.secure_url || data.url }));
            toast.success('Image uploaded');
        } catch {
            toast.error('Image upload failed');
        }
    };

    const getChannelName = id => allChannels.find(c => c.id === id)?.name || '—';

    // only filter by status now
    const filtered = announcements.filter(a => a.status === selectedTab);

    if (loading) {
        return <div className="section">Loading…</div>;
    }

    return (
        <div className="gov-announcement-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="gov-announcement-container">
                <div className="ga-topbar">
                    <Link to="/government-dashboard" className="ga-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <h2>Announcements</h2>
                </div>

                <div className="ga-content">
                    <div className="ac-header">
                        <h3>Latest Announcements</h3>
                        <button className="new-announcement-btn" onClick={() => setIsModalOpen(true)}>
                            + New Announcement
                        </button>
                    </div>

                    <div className="ac-tabs">
                        {['Active', 'Scheduled', 'Expired'].map(tab => (
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
                        {filtered.length ? (
                            filtered.map(a => (
                                <div key={a.id} className="ac-item">
                                    <h4>{a.title}</h4>
                                    <p><strong>Channel:</strong> {getChannelName(a.channelId)}</p>
                                    <p>{a.content}</p>
                                    {a.imageUrl && (
                                        <img src={a.imageUrl} alt="attachment" style={{ maxWidth: '100%', marginTop: 8 }} />
                                    )}
                                    <div className="ac-meta">
                                        <span>{new Date(a.timestamp).toLocaleString()}</span>
                                        <span>Status: {a.status}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No announcements in “{selectedTab}”.</p>
                        )}
                    </div>

                    {isModalOpen && (
                        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                            <div className="modal large" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Create Announcement</h3>
                                    <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                                </div>
                                <div className="modal-form two-column">
                                    {/* Left column */}
                                    <div>
                                        <label>Channel</label>
                                        <select
                                            size={6}
                                            value={newAnnouncement.channelId}
                                            onChange={e => setNewAnnouncement(n => ({ ...n, channelId: e.target.value }))}
                                            style={{ width: '100%', height: 150, fontSize: 14 }}
                                        >
                                            {allChannels.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>

                                        <label>Status</label>
                                        <select
                                            value={newAnnouncement.status}
                                            onChange={e => {
                                                const s = e.target.value;
                                                setNewAnnouncement(n => ({
                                                    ...n,
                                                    status: s,
                                                    scheduledAt: s === 'Scheduled' ? n.scheduledAt : ''
                                                }));
                                            }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Expired">Expired</option>
                                        </select>

                                        {newAnnouncement.status === 'Scheduled' && (
                                            <>
                                                <label>Schedule Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={newAnnouncement.scheduledAt}
                                                    onChange={e => setNewAnnouncement(n => ({ ...n, scheduledAt: e.target.value }))}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Right column */}
                                    <div>
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={newAnnouncement.title}
                                            onChange={e => setNewAnnouncement(n => ({ ...n, title: e.target.value }))}
                                        />

                                        <label>Content</label>
                                        <textarea
                                            rows={4}
                                            value={newAnnouncement.content}
                                            onChange={e => setNewAnnouncement(n => ({ ...n, content: e.target.value }))}
                                        />

                                        <label>Attach Image</label>
                                        <input type="file" onChange={handleImageUpload} />
                                        {newAnnouncement.imageUrl && (
                                            <img
                                                src={newAnnouncement.imageUrl}
                                                alt="preview"
                                                style={{ maxWidth: '100%', marginTop: 8 }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button onClick={handleCreate}>Post Announcement</button>
                                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default GovernmentAnnouncementPage;
