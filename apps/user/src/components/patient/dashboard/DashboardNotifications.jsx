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
            case 'CONFIRMATION': return <CheckCircle2 size={16} className='text-success-600 dark:text-success-500' />;
            case 'CANCELLATION': return <AlertCircle size={16} className='text-error-600 dark:text-error-500' />;
            case 'REMINDER':     return <Calendar size={16} className='text-warning-600 dark:text-warning-500' />;
            case 'WAITLIST':     return <Bell size={16} className='text-brand-600 dark:text-brand-500' />;
            default:             return <Info size={16} className='text-blue-600 dark:text-blue-500' />;
        }
    };

    return (
        <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
                    Notifications
                </h3>
                <span className='px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 rounded-md uppercase tracking-wider'>
                    Latest
                </span>
            </div>

            {/* Body */}
            <div className='flex-grow px-4 sm:px-6 py-4 space-y-4 overflow-y-auto'>
                {loading && notifications.length === 0 ? (
                    <div className='animate-pulse space-y-4'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='flex gap-3'>
                                <div className='h-8 w-8 bg-gray-100 dark:bg-white/5 rounded-lg shrink-0' />
                                <div className='space-y-2 grow'>
                                    <div className='h-3 w-28 bg-gray-100 dark:bg-white/5 rounded-lg' />
                                    <div className='h-2 w-full bg-gray-50 dark:bg-white/5 rounded-lg' />
                                    <div className='h-2 w-3/4 bg-gray-50 dark:bg-white/5 rounded-lg' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10 opacity-60'>
                        <Bell size={24} className='mb-2 text-gray-400' />
                        <p className='text-sm text-gray-500'>No notifications yet</p>
                    </div>
                ) : (
                    notifications.slice(0, 3).map((n) => {
                        const rendered = renderNotification(n);
                        return (
                            <Link
                                key={n.id}
                                to={`/patient/notifications?id=${n.id}`}
                                className='relative flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors group'
                            >
                                {!n.is_read && (
                                    <span className='absolute top-2.5 right-2 w-2 h-2 bg-brand-500 rounded-full' />
                                )}
                                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0 ${!n.is_read ? 'bg-brand-50 dark:bg-brand-500/10' : 'bg-gray-50 dark:bg-white/5'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className='flex-grow min-w-0'>
                                    <h4 className={`text-sm font-semibold leading-snug mb-1 truncate ${!n.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {rendered.title}
                                    </h4>
                                    <p className={`text-xs line-clamp-2 mb-1.5 ${!n.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {rendered.message}
                                    </p>
                                    <span className='text-[10px] text-gray-500 dark:text-gray-500'>
                                        {n.sent_at ? formatFullDateTime(n.sent_at) : ''}
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Footer Actions */}
            <div className='px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-3'>
                <button
                    onClick={markAllRead}
                    disabled={notifications.length === 0}
                    className='py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50'
                >
                    Mark all read
                </button>
                <Link
                    to='/patient/notifications'
                    className='py-2 text-sm font-medium text-center text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors'
                >
                    View all
                </Link>
            </div>
        </div>
    );
};

export default DashboardNotifications;
