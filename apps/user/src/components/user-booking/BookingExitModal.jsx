import React from 'react';
import { AlertTriangle } from 'lucide-react';

const BookingExitModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md w-screen h-screen'
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-[fadeIn_0.2s_ease-out] overflow-hidden'>
                {/* Visual Header Bar */}
                <div className='h-1.5 w-full bg-amber-500' />
                
                <div className='p-6 sm:p-10 space-y-8'>
                    {/* Icon & Title */}
                    <div className='flex flex-col items-center text-center space-y-5'>
                        <div className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500'>
                            <AlertTriangle size={32} />
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-outfit text-center uppercase tracking-tight'>
                                Exit Booking?
                            </h3>
                            <p className='mt-2 text-center text-[13px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto'>
                                Are you sure you want to stop? Your progress will be lost and your slot hold will be released.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-3'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-[15px] font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95'
                        >
                            Stay
                        </button>
                        <button
                            onClick={onConfirm}
                            className='flex-1 px-6 py-4 rounded-2xl bg-amber-500 text-[15px] font-black text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95'
                        >
                            Exit Wizard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingExitModal;
