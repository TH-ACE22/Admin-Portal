// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      {/* 
        Order matters:
        1) <Sidebar />
        2) <Topbar />
        3) <div className="dashboard-main"> 
      */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Topbar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="dashboard-main">
        <div className="dashboard-content">
          <h2>Overview</h2>

          {/* Example cards */}
          <div className="cards-grid">
            {[
              { icon: 'Users.svg', label: 'Active Users', value: '1,234' },
              { icon: 'reports.svg', label: 'Reports', value: '56' },
              { icon: 'channels.svg', label: 'Channels', value: '12' },
              { icon: 'announcements.svg', label: 'Announcements', value: '3' },
              { icon: 'activity.svg', label: 'Activity', value: '89' },
              { icon: 'health-sys.svg', label: 'System Health', value: 'Good' }
            ].map((card, i) => (
              <div className="card" key={i}>
                <img src={`/icons/${card.icon}`} alt={card.label} className="card-icon" />
                <div className="card-info">
                  <h3>{card.label}</h3>
                  <p>{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Extras: Summaries, Recent Activity, etc. */}
          <div className="dashboard-extras">
            <div className="summary-row">
              {[
                { label: 'Total Users', value: '5,678' },
                { label: 'New Registrations', value: '123' },
                { label: 'Total Revenue', value: '$45,678' },
                { label: 'Active Sessions', value: '234' }
              ].map((item, idx) => (
                <div className="summary-card" key={idx}>
                  <h4>{item.label}</h4>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <ul>
                <li>
                  <span>User John registered</span>
                  <span>2 min ago</span>
                </li>
                <li>
                  <span>Channel updated</span>
                  <span>10 min ago</span>
                </li>
                <li>
                  <span>Report approved</span>
                  <span>30 min ago</span>
                </li>
                <li>
                  <span>Settings changed</span>
                  <span>1 hour ago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
