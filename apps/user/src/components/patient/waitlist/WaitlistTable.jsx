import React, { useState } from 'react';
import { Badge } from '../../ui';
import { Trash2, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';

const STATUS_MAP = {
    'WAITING': { label: 'Waiting', color: 'info' },
    'OFFER_PENDING': { label: 'Offered', color: 'warning' },
    'CONFIRMED': { label: 'Confirmed', color: 'success' },
    'EXPIRED': { label: 'Expired', color: 'error' },
    'CANCELLED': { label: 'Cancelled', color: 'neutral' }
};

/**
 * Confirmation modal shown when a user tries to cancel a waitlist entry
 * that has a linked backup appointment.
 */
const WaitlistCancelModal = ({ item, onClose, onConfirm }) => {
    if (!item) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
            <div className='w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-300'>
                {/* Header */}
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0'>
                            <AlertTriangle size={18} className='text-amber-500' />
                        </div>
                        <div>
                            <h3 className='text-[15px] font-black text-slate-900 dark:text-white leading-tight'>
                                Remove from Waitlist?
                            </h3>
                            <p className='text-[12px] text-slate-500 dark:text-slate-400 mt-0.5'>
                                You have a Primary Appointment secured for this slot.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className='p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex-shrink-0'>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <p className='text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed'>
                    What would you like to do with your <span className='font-bold text-slate-900 dark:text-white'>Primary Appointment</span>?
                </p>

                {/* Actions */}
                <div className='flex flex-col gap-2'>
                    <button
                        onClick={() => onConfirm({ removeBackup: true })}
                        className='w-full py-3 px-4 rounded-2xl bg-red-500 text-white text-[12px] font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all'
                    >
                        Cancel Both
                    </button>
                    <button
                        onClick={() => onConfirm({ removeBackup: false })}
                        className='w-full py-3 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[12px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all'
                    >
                        Only Remove Waitlist
                    </button>
                    <button
                        onClick={onClose}
                        className='w-full py-2.5 px-4 rounded-2xl text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all'
                    >
                        Keep Both
                    </button>
                </div>
            </div>
        </div>
    );
};

const WaitlistTable = ({ data, activeFilter, onClaim, onCancel }) => {
    const [cancelTarget, setCancelTarget] = useState(null);

    const filtered = activeFilter === 'All' 
        ? data 
        : data.filter(i => i.status === activeFilter.toUpperCase());

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return 'Anytime';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    const handleCancelClick = (item) => {
        if (item.backup_appointment_id) {
            // Has a linked backup appointment — show confirmation modal
            setCancelTarget(item);
        } else {
            // No backup — cancel immediately
            onCancel(item.id, {});
        }
    };

    const handleModalConfirm = (options) => {
        if (cancelTarget) {
            onCancel(cancelTarget.id, options);
        }
        setCancelTarget(null);
    };

    return (
        <>
            {cancelTarget && (
                <WaitlistCancelModal
                    item={cancelTarget}
                    onClose={() => setCancelTarget(null)}
                    onConfirm={handleModalConfirm}
                />
            )}

            <div className='overflow-hidden rounded-[2rem] border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse min-w-[800px]'>
                        <thead>
                            <tr className='border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]'>
                                <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Service</th>
                                <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Target Slot</th>
                                <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Joined</th>
                                <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest'>Status</th>
                                <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                            {filtered.length > 0 ? filtered.map((item) => {
                                const statusInfo = STATUS_MAP[item.status] || { label: item.status, color: 'neutral' };
                                return (
                                    <tr key={item.id} className='hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors'>
                                        <td className='px-6 py-5'>
                                            <div className='flex flex-col'>
                                                <span className='text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight'>{item.service_name}</span>
                                                <span className='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>Position #{item.position}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-5'>
                                            <div className='flex flex-col'>
                                                <span className='text-[13px] font-bold text-slate-700 dark:text-slate-300'>{formatDate(item.preferred_date)}</span>
                                                <span className='text-[11px] font-black text-brand-500 uppercase tracking-wider'>{formatTime(item.preferred_time)}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-5'>
                                            <span className='text-[13px] font-medium text-slate-500 dark:text-slate-400'>{formatDate(item.joined_at)}</span>
                                        </td>
                                        <td className='px-6 py-5'>
                                            <div className='flex flex-col gap-1.5'>
                                                <Badge color={statusInfo.color}>
                                                    {statusInfo.label}
                                                </Badge>
                                                {item.backup_appointment_id && item.status === 'WAITING' && (
                                                    <span className='text-[9px] font-black text-amber-500 uppercase tracking-widest'>
                                                        + Primary Appt.
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-5 text-right'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {item.status === 'OFFER_PENDING' && (
                                                    <button 
                                                        onClick={() => onClaim(item)}
                                                        className='flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/10 active:scale-95'
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        Claim
                                                    </button>
                                                )}
                                                {item.status === 'WAITING' && (
                                                    <button 
                                                        onClick={() => handleCancelClick(item)}
                                                        className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all'
                                                        title="Remove from Waitlist"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                {item.status === 'CONFIRMED' && (
                                                    <span className='text-[11px] font-black text-success-500 uppercase tracking-widest flex items-center gap-1.5'>
                                                        <CheckCircle2 size={14} />
                                                        Claimed
                                                    </span>
                                                )}
                                                {(item.status === 'EXPIRED' || item.status === 'CANCELLED') && (
                                                    <span className='text-[11px] font-bold text-slate-400 uppercase italic opacity-60'>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className='px-6 py-20 text-center uppercase tracking-widest'>
                                        <div className='flex flex-col items-center justify-center gap-4 opacity-30'>
                                            <div className='w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center'>
                                                <Clock size={20} />
                                            </div>
                                            <span className='text-[10px] font-black text-slate-400'>No Active Requests Found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default WaitlistTable;
