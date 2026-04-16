import { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Stethoscope, 
    ShieldCheck, 
    AlertCircle, 
    RefreshCw,
    Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserReviewStep = ({ formData, book_for_others, onSubmit, onBack, onEdit, submitting, error }) => {
    const { user } = useAuth();
    const [isRetrying, setIsRetrying] = useState(false);

    // Auto-scroll to top on error
    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    const hasBooking = formData?.time;
    const hasWaitlist = formData?.waitlist_time;
    const isWaitlistOnly = hasWaitlist && !hasBooking;
    const isDualSelection = hasBooking && hasWaitlist;

    const formatDate = (dateString) => {
        if (!dateString) return 'Not selected';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) { return dateString; }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Not selected';
        try {
            const [hours, minutes] = timeString.split(':');
            const h = parseInt(hours, 10);
            const m = parseInt(minutes, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHour = h % 12 || 12;
            const formattedMinute = m < 10 ? `0${m}` : m;
            return `${formattedHour}:${formattedMinute} ${ampm}`;
        } catch (e) { return timeString; }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        try { await onSubmit(); } finally { setIsRetrying(false); }
    };

    const ReviewSection = ({ title, children, onEditClick }) => (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/80 lg:mb-6 lg:pb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 uppercase tracking-tight">
                    {title}
                </h4>
                <button
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-white/[0.03] dark:hover:text-white transition-colors shrink-0"
                >
                    <Edit2 size={14} className="text-gray-500 dark:text-gray-400" />
                    Edit
                </button>
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    );

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 sm:pb-6">
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Review Your Request
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium'>
                    Please carefully review your appointment details and patient information before final submission.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-400 p-5 rounded-3xl mb-8 animate-in shake duration-500'>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Submission Error</h4>
                            <p className="text-sm opacity-90 break-words leading-relaxed font-medium">{error}</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        <button onClick={handleRetry} disabled={submitting || isRetrying} className='flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold rounded-xl transition-all shadow-theme-md disabled:cursor-not-allowed uppercase tracking-widest'>
                            {submitting || isRetrying ? (<><div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />Retrying...</>) : (<><RefreshCw size={14} />Retry Submission</>)}
                        </button>
                    </div>
                </div>
            )}

            <div className='w-full space-y-6'>
                <ReviewSection title="Service Selection" onEditClick={() => onEdit(0)}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Selected Treatment</p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Stethoscope size={16} className="text-brand-500" />
                                {formData.service_name || 'No service selected'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Duration</p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">
                                {formData.service_duration ? `${formData.service_duration} mins` : '-'}
                            </p>
                        </div>
                    </div>
                </ReviewSection>

                <ReviewSection title="Date & Time" onEditClick={() => onEdit(1)}>
                    {hasBooking && (
                        <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 ${isDualSelection ? 'pb-6 border-b border-gray-50 dark:border-gray-800/50 mb-6' : ''}`}>
                            <div className="lg:col-span-2">
                                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>Primary Appointment</p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={16} className="text-brand-500" />{formatDate(formData.date)}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Time</p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><Clock size={16} className="text-brand-500" />{formatTime(formData.time)}</p>
                            </div>
                        </div>
                    )}
                    {hasWaitlist && (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                            <div className="lg:col-span-2">
                                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Waitlist Preference</p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</p>
                                <p className="text-[15px] sm:text-base font-bold text-amber-700 dark:text-amber-400/90 flex items-center gap-2"><Calendar size={16} className="text-amber-500" />{formatDate(formData.waitlist_date)}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Time</p>
                                <p className="text-[15px] sm:text-base font-bold text-amber-700 dark:text-amber-400/90 flex items-center gap-2"><Clock size={16} className="text-amber-500" />{formatTime(formData.waitlist_time)}</p>
                            </div>
                        </div>
                    )}
                </ReviewSection>

                <ReviewSection title="Patient Details" onEditClick={() => onEdit(2)}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
                        <div className="min-w-0">
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Full Name</p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                                <User size={16} className="text-brand-500 shrink-0" />
                                <span className="truncate">
                                    {book_for_others 
                                        ? `${formData.booked_for_last_name || ''}, ${formData.booked_for_first_name || ''} ${formData.booked_for_middle_name || ''} ${formData.booked_for_suffix_name || ''}`.replace(/\s+/g, ' ').trim()
                                        : (user?.first_name ? `${user.last_name}, ${user.first_name} ${user.middle_name || ''} ${user.suffix || ''}`.replace(/\s+/g, ' ').trim() : (user?.full_name || 'Authorized User'))
                                    }
                                </span>
                            </p>
                        </div>
                        <div className='min-w-0'>
                            <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Contact Email</p>
                            <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white break-all flex items-center gap-2">
                                <Mail size={16} className="text-brand-500 shrink-0" />
                                {user?.email}
                            </p>
                        </div>
                        {book_for_others && formData.booked_for_phone && (
                            <div>
                                <p className="mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Phone</p>
                                <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><Phone size={16} className="text-brand-500" />{formData.booked_for_phone}</p>
                            </div>
                        )}
                    </div>
                </ReviewSection>
            </div>

            {/* Final Navigation Footer */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-40 px-6 py-4 sm:px-0 sm:py-0 sm:mt-6 sm:pt-2 bg-white/95 dark:bg-gray-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-gray-100 dark:border-gray-800 sm:border-t-0 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none transition-all'>
                <div className='flex items-center gap-3 w-full sm:justify-between'>
                    <button onClick={onBack} disabled={submitting} className='flex-1 sm:flex-none sm:min-w-[120px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] sm:text-sm px-6 py-3.5 sm:px-8 transition-colors disabled:opacity-30 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 sm:bg-transparent rounded-2xl sm:rounded-2xl border border-transparent shadow-theme-xs'>Back</button>
                    <button onClick={onSubmit} disabled={submitting} className='flex-[2] sm:flex-none sm:min-w-[240px] group bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-12 sm:py-4.5 rounded-2xl transition-all shadow-theme-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-[12px] sm:text-base uppercase tracking-widest'>
                        {submitting ? (<><div className='w-4 h-4 sm:w-5 sm:h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin' />Finalizing...</>) : (<>{isWaitlistOnly ? 'Confirm Waitlist' : 'Confirm Booking'}<ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" /></>)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReviewStep;
