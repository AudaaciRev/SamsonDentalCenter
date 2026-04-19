import React, { useState, useEffect } from 'react';
import { X, ChevronDown, MessageSquare, AlertCircle } from 'lucide-react';

const CANCEL_REASONS = [
    "Schedule conflict",
    "Feeling unwell",
    "Personal emergency",
    "Transportation issues",
    "Other"
];

const AppointmentCancelModal = ({ show, onClose, cancelReason, setCancelReason, rawId, cancelling, handleCancel }) => {
    const [reasonType, setReasonType] = useState("");
    const [showOthers, setShowOthers] = useState(false);

    useEffect(() => {
        if (show) {
            setReasonType("");
            setShowOthers(false);
            setCancelReason("");
        }
    }, [show, setCancelReason]);

    if (!show) return null;

    const handleTypeChange = (e) => {
        const val = e.target.value;
        setReasonType(val);
        if (val === "Other") {
            setShowOthers(true);
            setCancelReason("");
        } else {
            setShowOthers(false);
            setCancelReason(val);
        }
    };

    const isReady = reasonType !== "" && (!showOthers || (showOthers && cancelReason.trim().length > 0));

    return (
        <div
            className='fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm'
            onClick={(e) => { if (e.target === e.currentTarget && !cancelling) { onClose(); } }}
        >
            <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 animate-[fadeIn_0.15s_ease-out] overflow-hidden'>
                {/* Visual Header Bar */}
                <div className='h-1.5 w-full bg-error-500' />

                <div className='p-6 sm:px-10 sm:py-8 space-y-6'>
                    {/* Centered Icon & Title */}
                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='w-14 h-14 rounded-xl bg-error-50 dark:bg-error-500/10 flex items-center justify-center text-error-500'>
                            <AlertCircle size={28} />
                        </div>
                        <div className='space-y-1.5'>
                            <h3 className='text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-outfit text-center'>
                                Wait! Are you sure?
                            </h3>
                            <p className='mt-2 text-center text-[13px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto'>
                                We're sorry you can't make it. You can always reschedule for a better time.
                            </p>
                        </div>
                    </div>

                    {/* Custom Selection Area */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between mb-2 px-1'>
                            <span className='text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                                Cancellation Reason
                            </span>
                        </div>
                        <div className='relative group'>
                            <div className={`absolute inset-0 bg-gray-100 dark:bg-white/5 rounded-lg transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-white/10`} />
                            <select
                                value={reasonType}
                                onChange={handleTypeChange}
                                disabled={cancelling}
                                className={`relative w-full bg-transparent border-2 border-transparent text-gray-900 dark:text-white px-4 py-3.5 rounded-lg text-sm font-bold focus:outline-none focus:border-error-500 transition-all appearance-none outline-none ${
                                    !reasonType ? 'text-gray-400 dark:text-gray-600' : ''
                                }`}
                            >
                                <option value="" disabled>Choose a reason...</option>
                                {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <ChevronDown size={18} className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-error-500 transition-colors' />
                        </div>

                        {showOthers && (
                            <div className='space-y-2 animate-[fadeIn_0.2s_ease-out]'>
                                <div className='flex items-center justify-between'>
                                    <label className='flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>
                                        <MessageSquare size={14} />
                                        Please specify
                                    </label>
                                    <span className='text-[10px] text-gray-400 font-bold'>{cancelReason.length}/300</span>
                                </div>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    disabled={cancelling}
                                    placeholder='Briefly tell us why...'
                                    rows={2}
                                    maxLength={300}
                                    className='w-full px-5 py-3 border border-slate-100 dark:border-gray-800 rounded-lg text-[14px] bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-error-500/50 resize-none transition-all'
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className='flex gap-3 pt-1'>
                        <button
                            onClick={onClose}
                            disabled={cancelling}
                            className='flex-1 py-3 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-95'
                        >
                            Keep It
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={cancelling || !isReady || (showOthers && cancelReason.trim().length < 2)}
                            className='flex-1 px-6 py-3.5 bg-error-500 hover:bg-error-600 text-white rounded-lg text-[15px] font-black transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2'
                        >
                            {cancelling ? (
                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                            ) : (
                                'Confirm Cancel'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCancelModal;
