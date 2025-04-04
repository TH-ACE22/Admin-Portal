import React, { useState } from 'react';
import GovernmentSidebar from '../components/GovernmentSidebar';
import GovernmentTopbar from '../components/GovernmentTopbar';
import '../styles/GovernmentDashboard.css';

const GovernmentD = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div className="gov-container">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`gov-main ${!sidebarOpen ? 'collapsed' : ''}`}>
                <GovernmentTopbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
                <div className="gov-body">
                    {/* Quick Stats Section */}
                    <section className="quick-stats">
                        <div className="stat-card">
                            <h3>Total Reports/Suggestions</h3>
                            <p>1200</p>
                        </div>
                        <div className="stat-card">
                            <h3>Reports Pending Review</h3>
                            <p>45</p>
                        </div>
                    </section>

                    {/* Charts Overview Section */}
                    <section className="charts-overview">
                        <h2>Dashboard Overview</h2>
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3>Reports Trend</h3>
                                <div className="chart-placeholder">
                                    {/* Placeholder for a bar chart */}
                                    [Bar Chart]
                                </div>
                            </div>
                            <div className="chart-card">
                                <h3>Report Status Distribution</h3>
                                <div className="chart-placeholder">
                                    {/* Placeholder for a pie chart */}
                                    [Pie Chart]
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* General Details Section */}
                    <section className="general-details">
                        <h2>Key Metrics</h2>
                        <div className="details-grid">
                            <div className="detail-card">
                                <h3>Average Resolution Time</h3>
                                <p>3 days</p>
                            </div>
                            <div className="detail-card">
                                <h3>User Engagement</h3>
                                <p>75%</p>
                            </div>
                            <div className="detail-card">
                                <h3>Monthly Reports</h3>
                                <p>320</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default GovernmentD;
