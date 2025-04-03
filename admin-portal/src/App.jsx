import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CommunityManagement from './pages/CommunityManagement';
import ChannelManagement from './pages/ChannelManagement';
import UserManagement from "./pages/UserManagement.jsx";
import ReportsAndSuggestions from "./pages/ReportAndSuggestions.jsx";
import AnnouncementsNotifications from "./pages/AnnouncementsNotifications.jsx";
import Settings from "./pages/Settings.jsx";

import Dashboard2 from "./pages/Dashboard2.jsx";
import GovernmentReportSuggestion from "./pages/GovernmentReportSuggestion.jsx";
import GovernmentChannelOverview from "./pages/GovernmentChannelOverview.jsx";
import GovernmentAnnouncementPage from "./pages/GovernmentAnnouncementPage.jsx";
import GovernmentNotificationPage from "./pages/GovernmentNotificationPage.jsx";
import GovernmentTeam from "./pages/GovernmentTeam.jsx";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/community-management" element={<CommunityManagement />} />
                <Route path="/channel-management" element={<ChannelManagement />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/reports" element={<ReportsAndSuggestions />} />
                <Route path="/announcements" element={<AnnouncementsNotifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/government" element={<Dashboard2/>} />
                <Route path="/gov-reports" element={<GovernmentReportSuggestion/>} />
                <Route path="/gov-channels" element={<GovernmentChannelOverview/>} />
                <Route path="/gov-notifications" element={<GovernmentNotificationPage/>} />
                <Route path="/gov-announcements" element={<GovernmentAnnouncementPage/>} />
                <Route path="/gov-team" element={<GovernmentTeam/>} />
                {/* Optional: Fallback for undefined routes */}
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </Router>
    );
};

export default App;
