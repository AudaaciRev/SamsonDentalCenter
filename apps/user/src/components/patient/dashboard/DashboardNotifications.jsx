import React from 'react';
import { Bell, CheckCircle2, Info, AlertCircle, Calendar } from 'lucide-react';
import useNotifications from '../../../hooks/useNotifications';
import { formatFullDateTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';
import { renderNotification } from '../../../utils/notificationRenderer';

const DashboardNotifications = () => {
    const { notifications, loading, markAllRead } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'CONFIRMATION': return <CheckCircle2 size={16} className='text-success-500' />;
            case 'CANCELLATION': return <AlertCircle size={16} className='text-error-500' />;
            case 'REMINDER':     return <Calendar size={16} className='text-warning-500' />;
            case 'WAITLIST':     return <Bell size={16} className='text-brand-500' />;
            default:             return <Info size={16} className='text-blue-500' />;
        }
    };

    return (
        <div className='rounded-none sm:rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800'>
                <h3 className='text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit'>
                    Notifications
                </h3>
                <span className='px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-white/[0.1] dark:text-white rounded-md sm:rounded-lg uppercase tracking-wider'>
                    Latest
                </span>
            </div>

            {/* Body */}
            <div className='flex-grow px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 overflow-y-auto'>
                {loading && notifications.length === 0 ? (
                    <div className='animate-pulse space-y-4'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='flex gap-3'>
                                <div className='h-9 w-9 bg-gray-100 dark:bg-white/5 rounded-xl shrink-0' />
                                <div className='space-y-2 grow'>
                                    <div className='h-3 w-28 bg-gray-100 dark:bg-white/5 rounded-full' />
                                    <div className='h-2 w-full bg-gray-50 dark:bg-white/[0.03] rounded-full' />
                                    <div className='h-2 w-3/4 bg-gray-50 dark:bg-white/[0.03] rounded-full' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10 opacity-40 dark:opacity-20 grayscale'>
                        <Bell size={36} className='mb-2 text-gray-400 dark:text-gray-500' />
                        <p className='text-xs font-medium text-gray-400 dark:text-gray-500'>No notifications yet</p>
                    </div>
                ) : (
                    notifications.slice(0, 3).map((n) => {
                        const rendered = renderNotification(n);
                        return (
                            <Link
                                key={n.id}
                                to={`/patient/notifications?id=${n.id}`}
                                className='relative flex items-start gap-3 hover:bg-gray-50/80 dark:hover:bg-white/[0.04] p-2 -m-2 rounded-xl transition-all group'
                            >
                                {!n.is_read && (
                                    <span className='absolute top-2.5 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]' />
                                )}
                                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${!n.is_read ? 'bg-brand-50 dark:bg-brand-500/20' : 'bg-gray-50 dark:bg-white/10'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className='flex-grow min-w-0'>
                                    <h4 className={`text-xs sm:text-sm font-semibold leading-snug mb-1 truncate ${!n.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {rendered.title}
                                    </h4>
                                    <p className={`text-[11px] sm:text-xs line-clamp-2 mb-1.5 ${!n.is_read ? 'text-gray-600 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {rendered.message}
                                    </p>
                                    <span className='text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500'>
                                        {n.sent_at ? formatFullDateTime(n.sent_at) : ''}
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Footer Actions */}
            <div className='px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 sm:gap-3'>
                <button
                    onClick={markAllRead}
                    disabled={notifications.length === 0}
                    className='py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50'
                >
                    Mark all read
                </button>
                <Link
                    to='/patient/notifications'
                    className='py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold text-center text-brand-600 dark:text-brand-400 border border-brand-50 dark:border-brand-500/20 bg-brand-50/30 dark:bg-brand-500/10 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/20 transition-colors'
                >
                    View all
                </Link>
            </div>
        </div>
    );
};

export default DashboardNotifications;
