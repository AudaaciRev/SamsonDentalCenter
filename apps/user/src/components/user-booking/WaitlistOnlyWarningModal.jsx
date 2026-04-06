import React from 'react';
import { AlertCircle, ArrowRight, ChevronLeft, Clock } from 'lucide-react';

/**
 * ✅ NEW: Warning modal for users who only pick a waitlist slot
 * Focuses on clarity and the non-guaranteed nature of waitlists.
 */
const WaitlistOnlyWarningModal = ({ onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-300'>
            <div className='bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10'>
                {/* Header with Warning Icon */}
                <div className='px-6 sm:px-8 pt-7 sm:pt-8 pb-3 sm:pb-4 flex items-center gap-4'>
                    <div className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 shadow-theme-xs flex-shrink-0'>
                        <AlertCircle size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <h3 className='text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight'>Waitlist Selection Only</h3>
                        <p className='text-[9px] sm:text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mt-0.5 sm:mt-1'>Action Required</p>
                    </div>
                </div>

                <div className='px-6 sm:px-8 pb-7 sm:pb-8 space-y-5 sm:space-y-6'>
                    <div className='space-y-3 sm:space-y-4'>
                        <p className='text-[14px] sm:text-[15px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed'>
                            You have only selected a waitlist spot for your preferred time. 
                        </p>
                        
                        <div className='p-4 sm:p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl'>
                            <p className='text-[13px] sm:text-sm font-bold text-amber-800 dark:text-amber-500 leading-relaxed italic'>
                                "Waitlisted slots are not guaranteed. You do not have a secured appointment unless a spot opens up and you claim it."
                            </p>
                        </div>

                        <p className='text-[13px] sm:text-[14px] font-bold text-slate-500 dark:text-slate-400'>
                            Would you like to proceed with just the waitlist request, or go back and secure a primary appointment time?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-col gap-2.5 sm:gap-3 pt-1 sm:pt-2'>
                        <button 
                            onClick={onConfirm}
                            className='w-full py-3.5 sm:py-4 bg-brand-500 hover:bg-brand-600 text-white font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 flex items-center justify-center gap-2'
                        >
                            Proceed Anyway
                            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            onClick={onCancel}
                            className='w-full py-3.5 sm:py-4 border-2 border-slate-100 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2'
                        >
                            <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                            Go Back to select time
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitlistOnlyWarningModal;
