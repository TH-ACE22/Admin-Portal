// src/components/ProfilePreferences.jsx
import React, { useState } from 'react';

const ProfilePreferences = () => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const [profile] = useState({
        name: 'Super Admin',
        email: 'admin@example.com'
    });

    return (
        <div className="section preferences-section">
            <h3>Profile & Preferences</h3>
            <div className="profile-section">
                <p>
                    <strong>Name:</strong> {profile.name}
                </p>
                <p>
                    <strong>Email:</strong> {profile.email}
                </p>
                <button onClick={() => alert('Profile management modal would open.')}>
                    Manage Profile
                </button>
            </div>
            <div className="theme-section">
                <p>
                    <strong>Theme:</strong> {darkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
            </div>
        </div>
    );
};

export default ProfilePreferences;
