// src/App.jsx (or wherever your main router is)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CommunityManagement from './pages/CommunityManagement';
import ChannelManagement from './pages/ChannelManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Additional route for Community Management */}
        <Route path="/community-management" element={<CommunityManagement />} />
        <Route path="/channel-management" element={<ChannelManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
