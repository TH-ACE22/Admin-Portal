import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/ReportsAndSuggestions.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const ReportsAndSuggestions = () => {
    const [reports, setReports] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCommunity, setFilterCommunity] = useState('All');
    const [filterChannel, setFilterChannel] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [responseText, setResponseText] = useState('');

    const token = localStorage.getItem('accessToken');

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${API_URL}/reports`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch reports');
                const data = await res.json();
                setReports(data);
            } catch (err) {
                console.error(err);
                setReports([]);
            }
        };
        fetchReports();
    }, [token]);

    const filteredReports = reports.filter(report =>
        (filterStatus === 'All' || report.status === filterStatus) &&
        (filterCommunity === 'All' || report.community === filterCommunity) &&
        (filterChannel === 'All' || report.channel === filterChannel)
    );

    const openRespondModal = (report) => {
        setSelectedReport(report);
        setResponseText('');
        setIsRespondModalOpen(true);
    };

    const closeRespondModal = () => {
        setIsRespondModalOpen(false);
        setSelectedReport(null);
    };

    const handleSendResponse = async () => {
        try {
            const res = await fetch(`${API_URL}/reports/${selectedReport.id}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ response: responseText })
            });

            if (!res.ok) throw new Error('Failed to send response');

            const updated = await res.json();
            setReports((prev) => prev.map(r => r.id === updated.id ? updated : r));
            closeRespondModal();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="reports-suggestions-page">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="reports-suggestions-container">
                <div className="rs-topbar">
                    <Link to="/dashboard" className="rs-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <button className="rs-menu-btn" onClick={handleToggleSidebar}>
                        <img src="/icons/menu.svg" alt="Toggle Sidebar" />
                    </button>
                    <h2>Reports & Suggestions</h2>
                </div>

                <div className="rs-content">
                    <div className="rs-filter">
                        <label>Status:</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <label>Community:</label>
                        <select value={filterCommunity} onChange={(e) => setFilterCommunity(e.target.value)}>
                            <option value="All">All</option>
                            {[...new Set(reports.map(r => r.community))].map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>

                        <label>Channel:</label>
                        <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)}>
                            <option value="All">All</option>
                            {[...new Set(reports.map(r => r.channel))].map(ch => (
                                <option key={ch}>{ch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="rs-table-container">
                        <table className="rs-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Community</th>
                                <th>Channel</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{report.title}</td>
                                        <td>{report.community}</td>
                                        <td>{report.channel}</td>
                                        <td className={`status-${report.status.toLowerCase()}`}>
                                            {report.status}
                                        </td>
                                        <td>{report.date}</td>
                                        <td>
                                            <button onClick={() => openRespondModal(report)}>
                                                Respond
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7">No reports available</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isRespondModalOpen && selectedReport && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Respond to Report</h3>
                        <p><strong>{selectedReport.title}</strong></p>
                        <p>{selectedReport.description}</p>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response here..."
                        ></textarea>
                        <div className="modal-actions">
                            <button onClick={handleSendResponse}>Send Response</button>
                            <button onClick={closeRespondModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsAndSuggestions;
