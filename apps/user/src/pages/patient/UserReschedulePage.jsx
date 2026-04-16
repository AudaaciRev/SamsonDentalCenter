import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppointmentDetail from '../../hooks/useAppointmentDetail';
import useUserReschedule from '../../hooks/useUserReschedule';
import UserRescheduleWizard from '../../components/user-reschedule/UserRescheduleWizard';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const UserReschedulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    
    // Fetch appointment
    const { appointment, loading: aptLoading, error: aptError } = useAppointmentDetail(id);
    
    // Initialize reschedule flow
    const reschedule = useUserReschedule(id, appointment);
    const { setIsDarkModeAllowed } = useTheme();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate(`/login?redirect=/patient/appointments/${id}/reschedule`);
        }
    }, [user, authLoading, navigate, id]);

    // Theme Guard: Allow dark mode while page is mounted
    useEffect(() => {
        setIsDarkModeAllowed(true);
        return () => setIsDarkModeAllowed(false);
    }, [setIsDarkModeAllowed]);

    if (authLoading || aptLoading) {
        return (
            <div className='min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center'>
                <Loader2 className='w-12 h-12 text-brand-500 animate-spin' />
            </div>
        );
    }

    if (aptError || !appointment) {
        return (
            <div className='min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-error-500 text-lg font-bold mb-2'>Appointment Not Found</h2>
                    <button 
                        onClick={() => navigate('/patient/appointments')}
                        className='text-brand-500 hover:text-brand-600 font-medium'
                    >
                        Return to My Appointments
                    </button>
                </div>
            </div>
        );
    }
    
    // Validate that it CAN be rescheduled (not cancelled/completed)
    const canReschedule = !['CANCELLED', 'LATE_CANCEL', 'COMPLETED', 'NO_SHOW'].includes(appointment.status);
    if (!canReschedule) {
        return (
            <div className='min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4'>
                <div className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-theme-sm text-center max-w-md w-full'>
                    <h2 className='text-amber-500 text-xl font-bold mb-2'>Cannot Reschedule</h2>
                    <p className='text-slate-500 dark:text-slate-400 mb-6'>This appointment cannot be rescheduled because its current status is {appointment.status}.</p>
                    <button 
                        onClick={() => navigate(`/patient/appointments/${id}`)}
                        className='bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-xl font-medium w-full transition-colors'
                    >
                        Return to Appointment
                    </button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <UserRescheduleWizard reschedule={reschedule} appointment={appointment} />
    );
};

export default UserReschedulePage;
