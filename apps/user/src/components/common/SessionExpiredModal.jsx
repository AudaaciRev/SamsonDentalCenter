import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

const SessionExpiredModal = ({ onLogout }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md scale-in-center overflow-hidden rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-500 dark:bg-amber-950/30">
                        <ShieldAlert size={48} strokeWidth={1.5} />
                    </div>
                    
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Session Expired
                    </h2>
                    
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                        For your security, your session has ended. Please log in again to continue managing your appointments.
                    </p>
                    
                    <button
                        onClick={onLogout}
                        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
                    >
                        <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
                        Log In Again
                    </button>
                    
                    <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">
                        Redirecting will clear your local session data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
