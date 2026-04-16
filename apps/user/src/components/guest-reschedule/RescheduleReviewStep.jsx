import { useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Info, CheckCircle, AlertTriangle, User, Stethoscope } from 'lucide-react';

const RescheduleReviewStep = ({ currentAppt, newData, onBack, onSubmit, submitting, error }) => {
    
    useEffect(() => {
        if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [error]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not selected';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Not selected';
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${minutes} ${ampm}`;
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Review New Schedule
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium'>
                    Confirm your new appointment details. The previous slot will be released once you confirm.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold mb-8 flex gap-3 items-center animate-in shake'>
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
                {/* ── FROM (Old) ── */}
                <div className="p-6 sm:p-8 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 relative opacity-60 grayscale-[0.5]">
                    <span className="absolute -top-3 left-8 px-4 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">Current Slot</span>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-gray-400" size={20} />
                            <p className="text-base font-bold text-gray-600 dark:text-gray-400">{formatDate(currentAppt.date)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-gray-400" size={20} />
                            <p className="text-base font-bold text-gray-600 dark:text-gray-400">{formatTime(currentAppt.time)}</p>
                        </div>
                    </div>
                </div>

                {/* ── TO (New) ── */}
                <div className="p-6 sm:p-8 rounded-[32px] border-2 border-brand-100 dark:border-brand-500/20 bg-brand-50/30 dark:bg-brand-500/5 relative shadow-theme-lg">
                    <span className="absolute -top-3 left-8 px-4 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-500/30 animate-pulse">New Slot</span>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-brand-500" size={20} />
                            <p className="text-base font-bold text-gray-900 dark:text-white">{formatDate(newData.date)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-brand-500" size={20} />
                            <p className="text-base font-bold text-gray-900 dark:text-white">{formatTime(newData.time)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Context Card */}
            <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-theme-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Stethoscope size={14} /> Service Selection
                        </p>
                        <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {currentAppt.service}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <User size={14} /> Patient Name
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {currentAppt.guest_name || currentAppt.patient_name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 pt-8 border-t border-gray-100 dark:border-gray-800'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='w-full sm:w-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[13px] sm:text-sm px-8 py-3 transition-colors uppercase tracking-widest'
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-10 py-4.5 rounded-2xl transition-all shadow-theme-lg flex items-center justify-center gap-3 uppercase tracking-widest'
                >
                    {submitting ? 'Updating...' : 'Confirm Reschedule'}
                    <CheckCircle size={20} />
                </button>
            </div>
        </div>
    );
};

export default RescheduleReviewStep;
