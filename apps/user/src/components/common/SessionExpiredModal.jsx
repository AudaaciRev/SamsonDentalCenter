import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { Modal } from '../ui/Modal';

const SessionExpiredModal = ({ onLogout }) => {
    return (
        <Modal 
            isOpen={true} 
            onClose={onLogout} 
            showCloseButton={false} 
            className='max-w-[440px] mx-4 sm:mx-0 w-[calc(100%-32px)] sm:w-full'
        >
            <div className="p-7 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                {/* Icon Container - Scaled for better mobile real estate */}
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[1.75rem] sm:rounded-[2rem] bg-amber-50 dark:bg-amber-500/10 text-amber-500 animate-in zoom-in duration-500">
                    <ShieldAlert size={32} className="sm:hidden" strokeWidth={1.5} />
                    <ShieldAlert size={42} className="hidden sm:block" strokeWidth={1.5} />
                </div>
                
                {/* Friendly Messaging */}
                <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight">
                        Session Timed Out
                    </h2>
                    <p className="text-[13px] sm:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[280px] sm:max-w-[320px] mx-auto">
                        For your security, we've signed you out since you've been inactive. No worries—just sign back in to continue!
                    </p>
                </div>
                
                {/* High-Fidelity Action Button */}
                <button
                    onClick={onLogout}
                    className="group relative flex w-full items-center justify-center gap-3 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white bg-brand-500 rounded-xl sm:rounded-2xl shadow-[0_15px_30px_-10px_rgba(59,130,246,0.4)] hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <LogOut size={16} strokeWidth={3} className="sm:hidden transition-transform group-hover:translate-x-1" />
                    <LogOut size={18} strokeWidth={3} className="hidden sm:block transition-transform group-hover:translate-x-1" />
                    Secure Sign In
                </button>
                
                {/* Muted Hint */}
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 opacity-40">
                    Your session data has been cleared
                </p>
            </div>
        </Modal>
    );
};

export default SessionExpiredModal;
