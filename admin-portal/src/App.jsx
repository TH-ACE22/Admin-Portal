// src/App.jsx
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/LoginPage';
import Dashboard   from './pages/Dashboard';
import Dashboard2  from './pages/Dashboard2.jsx';
import CommunityManagement      from './pages/CommunityManagement';
import ChannelManagement        from './pages/ChannelManagement';
import UserManagement           from './pages/UserManagement.jsx';
import ReportsAndSuggestions    from './pages/ReportAndSuggestions.jsx';
import AnnouncementsNotifications from './pages/AnnouncementsNotifications.jsx';
import Settings                 from './pages/Settings.jsx';
import GovernmentReportSuggestion  from './pages/GovernmentReportSuggestion.jsx';
import GovernmentChannelOverview   from './pages/GovernmentChannelOverview.jsx';
import GovernmentAnnouncementPage  from './pages/GovernmentAnnouncementPage.jsx';
import GovernmentNotificationPage  from './pages/GovernmentNotificationPage.jsx';
import GovernmentTeam            from './pages/GovernmentTeam.jsx';

import ProtectedRoute from './components/ProtectedRoute';

// Helper to redirect unmatched URLs based on login & role
const HomeRedirect = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    const role = localStorage.getItem('appRole');
    if (role === 'ROLE_ADMIN') {
        return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === 'ROLE_GOVERNMENT_OFFICIAL') {
        return <Navigate to="/government-dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
};

const App = () => (
    <Router>
        <Routes>
            {/* Public routes */}
            <Route path="/"   element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin-only */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user-management"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/community-management"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <CommunityManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/channel-management"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <ChannelManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <ReportsAndSuggestions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/announcements"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <AnnouncementsNotifications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* Government-official-only */}
            <Route
                path="/government-dashboard"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <Dashboard2 />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gov-reports"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <GovernmentReportSuggestion />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gov-channels"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <GovernmentChannelOverview />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gov-announcements"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <GovernmentAnnouncementPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gov-notifications"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <GovernmentNotificationPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gov-team"
                element={
                    <ProtectedRoute requiredRoles={['ROLE_GOVERNMENT_OFFICIAL']}>
                        <GovernmentTeam />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all: send to appropriate landing or login */}
            <Route path="*" element={<HomeRedirect />} />
        </Routes>
    </Router>
);

export default App;
