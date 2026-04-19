import React from 'react';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { formatDate, formatTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';

const TIME_SLOTS = [
    { label: '8 AM', value: '08:00' },
    { label: '10 AM', value: '10:00' },
    { label: '12 PM', value: '12:00' },
    { label: '2 PM', value: '14:00' },
    { label: '4 PM', value: '16:00' }
];

export default function DashboardCalendar({ appointments = [], loading = false }) {
    // Generate next 7 days
    const next7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    if (loading) {
        return (
            <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col h-full animate-pulse'>
                {/* Header Skeleton */}
                <div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 shrink-0' />
                        <div className='h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded' />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className='overflow-x-auto grow'>
                    <div className='min-w-[500px] sm:min-w-[700px] h-full flex flex-col'>
                        {/* Days Header Skeleton */}
                        <div className='grid grid-cols-8 border-b border-gray-200 dark:border-gray-800'>
                            <div className='p-3 border-r border-gray-200 dark:border-gray-800' />
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className='p-3 text-center border-r last:border-r-0 border-gray-200 dark:border-gray-800'>
                                    <div className='h-3 w-8 bg-gray-100 dark:bg-gray-800 rounded mx-auto mb-1' />
                                    <div className='h-5 w-6 bg-gray-50 dark:bg-gray-800/50 rounded mx-auto' />
                                </div>
                            ))}
                        </div>

                        {/* Time Slots Skeleton */}
                        {[...Array(5)].map((_, slotIdx) => (
                            <div key={slotIdx} className='grid grid-cols-8 border-b last:border-b-0 border-gray-200 dark:border-gray-800 min-h-[72px]'>
                                <div className='p-3 border-r border-gray-200 dark:border-gray-800 flex items-start justify-center'>
                                    <div className='h-3 w-8 bg-gray-100 dark:bg-gray-800 rounded' />
                                </div>
                                {[...Array(7)].map((_, dayIdx) => (
                                    <div key={dayIdx} className='p-1.5 border-r last:border-r-0 border-gray-200 dark:border-gray-800' />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col h-full'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded shrink-0 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center'>
                        <CalendarIcon size={18} />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
                            Weekly Schedule
                        </h3>
                    </div>
                </div>
                <Link 
                    to="/patient/appointments"
                    className='text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors'
                >
                    View All
                </Link>
            </div>

            {/* Calendar Grid */}
            <div className='overflow-x-auto grow'>
                <div className='min-w-[500px] sm:min-w-[700px] h-full flex flex-col'>
                    {/* Days Header */}
                    <div className='grid grid-cols-8 border-b border-gray-200 dark:border-gray-800'>
                        <div className='p-2 sm:p-3 border-r border-gray-200 dark:border-gray-800' />
                        {next7Days.map((day, i) => (
                            <div key={i} className={`p-2 sm:p-3 text-center border-r last:border-r-0 border-gray-200 dark:border-gray-800 ${isToday(day) ? 'bg-brand-50/50 dark:bg-brand-500/10' : ''}`}>
                                <p className='text-[10px] sm:text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-0.5 tracking-tighter sm:tracking-normal'>
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <p className={`text-[15px] sm:text-[18px] font-black ${isToday(day) ? 'text-brand-600 dark:text-brand-400' : 'text-gray-900 dark:text-gray-100'} tracking-tight`}>
                                    {day.getDate()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Time Grid */}
                    <div className='flex-grow'>
                        {TIME_SLOTS.map((slot, timeIdx) => (
                            <div key={timeIdx} className='grid grid-cols-8 border-b last:border-b-0 border-gray-200 dark:border-gray-800 min-h-[64px] sm:min-h-[72px] lg:min-h-[84px]'>
                                {/* Time Label */}
                                <div className='p-2 sm:p-3 border-r border-gray-200 dark:border-gray-800 flex items-start justify-center'>
                                    <span className='text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight'>
                                        {slot.label}
                                    </span>
                                </div>

                                {/* Day Slots */}
                                {next7Days.map((day, dayIdx) => {
                                    // Find appointments for this day and approximate time slot
                                    const appts = appointments.filter(a => {
                                        const apptDate = new Date(a.date);
                                        const isSameDay = apptDate.getDate() === day.getDate() && 
                                                        apptDate.getMonth() === day.getMonth();
                                        if (!isSameDay) return false;
                                        
                                        const apptHour = parseInt(a.start_time.split(':')[0], 10);
                                        const slotHour = parseInt(slot.value.split(':')[0], 10);
                                        return apptHour >= slotHour && apptHour < slotHour + 2;
                                    });

                                    return (
                                        <div key={dayIdx} className='p-1 sm:p-1.5 border-r last:border-r-0 border-gray-200 dark:border-gray-800 relative group/slot hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                                            {appts.map((app, i) => (
                                                <div 
                                                    key={i}
                                                    className='mb-1 last:mb-0 p-1 sm:p-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400 cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all shadow-sm'
                                                    onClick={() => window.location.href = `/patient/appointments/${app.id}`}
                                                >
                                                    <p className='text-[8px] sm:text-[9px] font-bold leading-none mb-0.5 opacity-70 uppercase tracking-tighter'>
                                                        {formatTime(app.start_time)}
                                                    </p>
                                                    <p className='text-[10px] sm:text-xs font-bold leading-tight truncate tracking-tight'>
                                                        {app.service?.name || app.service}
                                                    </p>
                                                </div>
                                            ))}
                                            
                                            {/* Add Button (Visible on hover if slot empty) */}
                                            {appts.length === 0 && (
                                                <button 
                                                    className='absolute inset-0 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity w-full h-full'
                                                    onClick={() => window.location.href = `/patient/book?date=${day.toISOString().split('T')[0]}&time=${slot.value}`}
                                                >
                                                    <span className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium'>+</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
