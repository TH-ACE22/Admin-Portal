// src/pages/ReportsAndSuggestions.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import '../styles/GovernmentSuggestionReport.css';

// Reusable modal component
const RespondModal = ({ report, responseText, setResponseText, onClose, onSend }) => (
    <div className="modal-overlay">
        <div className="modal">
            <h3>Respond to Report</h3>
            <p><strong>{report.title}</strong></p>
            <p>{report.description}</p>
            <textarea
                id="response-text"
                name="response-text"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows="5"
            ></textarea>
            <div className="modal-actions">
                <button onClick={onSend}>Send Response</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
);

const GovernmentReportSuggestion = () => {
    const initialReports = [
        {
            id: 'rep1',
            title: 'Issue with Community App',
            description: 'There is a bug causing unexpected logout in the community app.',
            status: 'Pending',
            community: 'Mahalapye',
            channel: 'In-App',
            date: '2023-04-01 12:00',
        },
        {
            id: 'rep2',
            title: 'Suggestion: Dark Mode',
            description: 'I suggest adding a dark mode option for better usability at night.',
            status: 'Resolved',
            community: 'Gaborone',
            channel: 'Email',
            date: '2023-04-02 15:30',
        },
        {
            id: 'rep3',
            title: 'Service Quality Report',
            description: 'The service quality has declined recently in my area.',
            status: 'Pending',
            community: 'Gaborone',
            channel: 'In-App',
            date: '2023-04-03 09:45',
        },
    ];

    const [reports] = useState(initialReports);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCommunity, setFilterCommunity] = useState('All');
    const [filterChannel] = useState('In-App');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [responseText, setResponseText] = useState('');

    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const openRespondModal = (report) => {
        setSelectedReport(report);
        setResponseText('');
        setIsRespondModalOpen(true);
    };

    const closeRespondModal = () => {
        setSelectedReport(null);
        setIsRespondModalOpen(false);
    };

    const handleSendResponse = () => {
        alert(`Response sent for report ${selectedReport.id}:\n${responseText}`);
        closeRespondModal();
    };

    const filteredReports = reports.filter(report =>
        (filterStatus === 'All' || report.status === filterStatus) &&
        (filterCommunity === 'All' || report.community === filterCommunity) &&
        report.channel === filterChannel
    );

    const renderTableRows = () => {
        if (filteredReports.length === 0) {
            return (
                <tr>
                    <td colSpan="7">No reports available</td>
                </tr>
            );
        }

        return filteredReports.map((report) => (
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
                    <button onClick={() => openRespondModal(report)}>Respond</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="gov-servant-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />

            <div className="gov-servant-container">
                {/* Top Bar */}
                <div className="gov-page-header">
                    <Link to="/government" className="gov-home-btn" aria-label="Go to Home">
                        <img src="/icons/home.svg" alt="Home Icon" />
                    </Link>
                    <h2>Reports & Suggestions</h2>
                </div>

                <div className="gov-content">
                    {/* Filters */}
                    <div className="gov-filter">
                        <label htmlFor="status-filter">Status:</label>
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <label htmlFor="community-filter">Community:</label>
                        <select
                            id="community-filter"
                            value={filterCommunity}
                            onChange={(e) => setFilterCommunity(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Mahalapye">Mahalapye</option>
                            <option value="Gaborone">Gaborone</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="gov-table-container">
                        <table className="gov-table">
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
                            <tbody>{renderTableRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isRespondModalOpen && selectedReport && (
                <RespondModal
                    report={selectedReport}
                    responseText={responseText}
                    setResponseText={setResponseText}
                    onClose={closeRespondModal}
                    onSend={handleSendResponse}
                />
            )}
        </div>
    );
};

export default GovernmentReportSuggestion;
