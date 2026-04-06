import React, { useState } from 'react';
import { Clock, AlertCircle, X, CheckCircle2, Info } from 'lucide-react';

/**
 * ✅ NEW: Dumb UI component for joining waitlist
 *
 * Does NOT make API calls - only handles UI and passes data up to parent
 * Parent (DateTimeStep) is responsible for updating form state
 * Actual API submission happens during final form submission (Confirm step)
 */
const JoinWaitlistModal = ({ date, time, rawTime, onSuccess, onClose }) => {
    const handleJoinClick = () => {
        onSuccess({ date, time: rawTime || time });
    };

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'>
            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20'>
                {/* Header - Minimalist */}
                <div className='px-8 pt-8 pb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl'><Clock size={18} className='text-amber-500' /></div>
                        <h3 className='text-md font-black text-slate-900 dark:text-white uppercase tracking-widest'>Waitlist Request</h3>
                    </div>
                </div>

                <div className='px-8 pb-8 space-y-6 text-left'>
                    <p className='text-sm font-bold text-slate-900 dark:text-white px-1'>
                        Here is how our waitlist works:
                    </p>

                    {/* Bullet Points - Final Readable Version */}
                    <div className='space-y-5'>
                        <div className='flex items-start gap-4'>
                            <div className='w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-[11px] font-black text-amber-500 shrink-0 border border-amber-100 dark:border-amber-900/30'>1</div>
                            <p className='text-[13px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed'>
                                <span className="text-slate-900 dark:text-white">Waitlists are not guaranteed:</span> This is a secondary request for a currently booked time slot. All appointments require clinic approval.
                            </p>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-[11px] font-black text-amber-500 shrink-0 border border-amber-100 dark:border-amber-900/30'>2</div>
                            <p className='text-[13px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed'>
                                <span className="text-slate-900 dark:text-white">Watch your notifications:</span> If this spot opens up, we will notify you immediately. You will have a 30-minute window to claim it before it is offered to the next patient.
                            </p>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-[11px] font-black text-amber-500 shrink-0 border border-amber-100 dark:border-amber-900/30'>3</div>
                            <p className='text-[13px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed'>
                                <span className="text-slate-900 dark:text-white">Swap your appointment:</span> If you claim the spot, you can seamlessly swap it with your primary appointment request. If you miss the window, your primary request remains perfectly safe.
                            </p>
                        </div>
                    </div>

                    <p className='text-[10px] italic text-slate-400 dark:text-slate-500 font-bold px-1'>
                         Please note: All appointments require clinic approval, and waitlists are not guaranteed.
                    </p>

                    <div className='flex gap-3 pt-2'>
                        <button 
                            onClick={onClose}
                            className='flex-1 py-4 border-2 border-slate-50 dark:border-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-[12px] uppercase tracking-widest rounded-2xl transition-all'
                        >
                            Nevermind
                        </button>
                        <button 
                            onClick={handleJoinClick}
                            className='flex-[1.5] py-4 bg-brand-500 hover:bg-brand-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-500/20 transition-all active:scale-95'
                        >
                            Join Waitlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinWaitlistModal;
