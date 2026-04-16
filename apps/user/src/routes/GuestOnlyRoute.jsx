import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

/**
 * GuestOnlyRoute — inverse of ProtectedRoute.
 * If the user IS logged in, redirect them to /patient/book instead.
 * If not logged in, render the page normally.
 */
const GuestOnlyRoute = ({ children, redirectTo = '/patient/book' }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoader message='One moment please...' />;
    }

    if (user) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default GuestOnlyRoute;
