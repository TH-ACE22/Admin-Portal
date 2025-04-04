// src/pages/GovernmentTeam.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GovernmentSidebar from '../components/GovernmentSidebar';
import '../styles/GovernmentTeam.css';

const GovernmentTeam = () => {
    const initialTeamMembers = [
        {
            id: 'tm1',
            name: 'Jane Smith',
            role: 'Manager',
            recentAction: 'Resolved report 12 min ago'
        },
        {
            id: 'tm2',
            name: 'Robert Brown',
            role: 'Assistant',
            recentAction: 'Reviewed report 20 min ago'
        },
        {
            id: 'tm3',
            name: 'Alice Johnson',
            role: 'Operator',
            recentAction: 'Assigned new report 5 min ago'
        }
    ];

    const [teamMembers] = useState(initialTeamMembers);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="gov-team-page">
            <GovernmentSidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
            <div className="gov-team-container">
                <div className="gt-topbar">
                    <Link to="/government" className="gt-home-btn">
                        <img src="/icons/home.svg" alt="Home" />
                    </Link>
                    <h2>Team Members</h2>
                </div>
                <div className="gt-content">
                    <div className="team-cards">
                        {teamMembers.length > 0 ? (
                            teamMembers.map((member) => (
                                <div key={member.id} className="team-card">
                                    <h3>{member.name}</h3>
                                    <p className="role">{member.role}</p>
                                    <p className="recent-action">{member.recentAction}</p>
                                </div>
                            ))
                        ) : (
                            <p>No team members available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GovernmentTeam;
