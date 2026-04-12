import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminPortalLayout from '../layouts/AdminPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PlaceholderPage from '../pages/admin/PlaceholderPage';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ── Auth ── */}
                <Route
                    path='/login'
                    element={<LoginPage />}
                />

                {/* ── Admin Portal (Sidebar Layout) ── */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <AdminPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path='staff' element={<PlaceholderPage title="Staff Management" />} />
                    <Route path='patients' element={<PlaceholderPage title="Patients" />} />
                    <Route path='settings' element={<PlaceholderPage title="Clinic Settings" />} />
                    <Route path='notifications' element={<PlaceholderPage title="Notifications" />} />
                    <Route path='profile' element={<PlaceholderPage title="Profile" />} />
                </Route>

                {/* ── Catch-all ── */}
                <Route
                    path='*'
                    element={
                        <Navigate
                            to='/'
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
};

export default AppRoutes;
