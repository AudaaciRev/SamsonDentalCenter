import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, formatTime } from '../../hooks/useAppointments';

const UserRescheduleSuccess = ({ newDate, newTime, serviceName, onReturn }) => {
    return (
        <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-theme-sm text-center animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-success-50 dark:bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-success-500" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Appointment Rescheduled!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Your appointment has been successfully updated. We've sent you an email with the new details.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 text-left border border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">New Appointment Details</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Service</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{serviceName}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Date</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {newDate ? new Date(newDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Time</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {newTime ? formatTime(newTime) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onReturn}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 dark:text-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
                Return to My Appointments
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

export default UserRescheduleSuccess;
