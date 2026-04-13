import React from 'react';
import { Modal } from '../../ui/Modal';
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

const ClaimSlotModal = ({ isOpen, onClose, slot, onConfirm, loading }) => {
    if (!slot) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className='max-w-[500px]'>
            <div className='p-6 sm:p-8 space-y-8'>
                <div className='text-center space-y-2'>
                    <h3 className='text-2xl font-bold font-outfit text-gray-800 dark:text-white uppercase tracking-tight'>
                        Claim This Slot
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                        Secure your earlier appointment for <strong>{slot.service_name}</strong>.
                    </p>
                </div>

                {/* Comparison Card */}
                <div className='flex flex-col items-center justify-center gap-6'>
                    {/* New Slot Highlight */}
                    <div className='w-full p-6 rounded-3xl border-2 border-brand-500 bg-brand-50/10 dark:bg-brand-500/5 text-center shadow-2xl shadow-brand-500/10 animate-in zoom-in duration-500'>
                        <span className='inline-block px-3 py-1 rounded-full bg-brand-500 text-[10px] font-black text-white uppercase tracking-widest mb-4'>
                            Target Slot
                        </span>
                        <div className='space-y-1'>
                            <p className='text-xl font-black text-gray-900 dark:text-white'>{formatDate(slot.preferred_date)}</p>
                            <p className='text-base font-black text-brand-500 uppercase tracking-wider'>{formatTime(slot.preferred_time)}</p>
                        </div>
                    </div>
                </div>

                <div className='flex items-start gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'>
                    <AlertTriangle className='text-amber-600 shrink-0' size={20} />
                    <p className='text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-bold'>
                        By claiming this, your original appointment will be automatically swapped to this new time. This action cannot be undone.
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row gap-3'>
                    <button 
                        onClick={onClose}
                        disabled={loading}
                        className='flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all rounded-2xl disabled:opacity-50'
                    >
                        Maybe Later
                    </button>
                    <button 
                        disabled={loading}
                        className='flex-1 flex items-center justify-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest text-white bg-brand-500 hover:bg-brand-600 transition-all rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 disabled:opacity-50'
                        onClick={() => onConfirm(slot.id)}
                    >
                        {loading ? <Loader2 className='animate-spin' size={18} /> : (
                            <>
                                Claim Now
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ClaimSlotModal;
