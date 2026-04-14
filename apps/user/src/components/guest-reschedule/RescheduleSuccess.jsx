import { CheckCircle, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RescheduleSuccess = ({ result }) => {
    const navigate = useNavigate();
    const { appointment } = result;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${minutes} ${ampm}`;
    };

    return (
        <div className="w-full max-w-[550px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[36px] p-8 sm:p-10 shadow-theme-lg overflow-hidden relative">
                {/* Brand Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"></div>

                {/* Header */}
                <div className='mb-10 text-center'>
                    <div className='w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-inner'>
                        <CheckCircle className='w-10 h-10 text-emerald-500' />
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-3'>
                        Rescheduled!
                    </h2>
                    <p className='text-[14px] sm:text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium px-4'>
                        Your appointment has been moved to the new slot. We've updated your schedule in our records.
                    </p>
                </div>

                {/* New Details Card */}
                <div className='bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 mb-10 text-center'>
                    <p className='text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4'>New Appointment Details</p>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-black text-lg sm:text-xl">
                                <Calendar size={20} className="text-gray-400" />
                                {formatDate(appointment.appointment_date)}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-black text-lg sm:text-xl">
                                <Clock size={20} className="text-gray-400" />
                                {formatTime(appointment.start_time)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className='text-xs text-gray-500 dark:text-gray-400 text-center mb-10 leading-relaxed'>
                    A confirmation of this change has been sent to <strong>{appointment.guest_email || 'your email'}</strong>. 
                </p>

                {/* Actions */}
                <button
                    onClick={() => navigate('/')}
                    className='w-full group bg-gray-900 dark:bg-brand-500 hover:opacity-90 active:scale-95 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-theme-lg flex items-center justify-center gap-3 uppercase tracking-widest text-sm'
                >
                    Back to Home
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default RescheduleSuccess;
