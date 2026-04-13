import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import SecretaryPortalLayout from '../layouts/SecretaryPortalLayout';

// Route utils
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from './ScrollToTop';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';

// Secretary pages
import SecretaryDashboard from '../pages/secretary/SecretaryDashboard';

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

                {/* ── Secretary Portal (Sidebar Layout) ── */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute allowedRoles={['secretary', 'dentist', 'admin']}>
                            <SecretaryPortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<SecretaryDashboard />} />
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
