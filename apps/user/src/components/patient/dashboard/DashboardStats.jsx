import React from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Calendar } from 'lucide-react';
import StatCard from './StatCard';
import { formatDate, formatTime } from '../../../hooks/useAppointments';
import { Link } from 'react-router-dom';

const DashboardStats = ({ entries = [], appointments = [], totalAppointments = 0, loading = false }) => {
    // Latest Appointment — most recently created
    // NOTE: backend returns `date` (not `appointment_date`)
    const latestAppt = [...appointments]
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))[0];

    const pendingCount = appointments.filter(a => (a.status || '').toUpperCase() === 'PENDING').length;
    const approvedCount = appointments.filter(a => {
        const s = (a.status || '').toUpperCase();
        const as = (a.approval_status || '').toLowerCase();
        const isApproved = s === 'CONFIRMED' || as === 'approved';
        const isInactive = ['CANCELLED', 'LATE_CANCEL', 'NO_SHOW', 'RESCHEDULED'].includes(s);
        return isApproved && !isInactive;
    }).length;
    const waitlistCount = entries.length;

    const serviceName = loading ? '…' : (latestAppt ? latestAppt.service?.name || latestAppt.service : null);

    return (
        <div className='space-y-3 sm:space-y-4'>

            {/* ── Row 1: Latest Appointment — full width hero card ── */}
            <div className='group relative rounded-none sm:rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm hover:shadow-theme-md transition-all duration-300 overflow-hidden'>
                <div className='flex items-stretch'>
                    {/* Left accent bar */}
                    <div className='w-1.5 bg-gradient-to-b from-brand-400 to-brand-600 shrink-0' />

                    {/* Icon */}
                    <div className='flex items-center justify-center px-4 sm:px-5'>
                        <div className='flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 transition-transform group-hover:scale-105 duration-300'>
                            <Clock size={22} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className='flex-grow py-4 sm:py-5 min-w-0'>
                        {/* Label */}
                        <p className='text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1'>
                            Latest Appointment
                        </p>
                        {/* Service name */}
                        <h3 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white font-outfit truncate leading-tight'>
                            {loading
                                ? <span className='inline-block w-36 h-5 bg-gray-100 dark:bg-white/10 rounded-full animate-pulse' />
                                : serviceName || 'No appointments yet'
                            }
                        </h3>
                        {/* Date · Time pills */}
                        {latestAppt && !loading && (
                            <div className='flex items-center gap-2 mt-2 flex-wrap'>
                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-[11px] sm:text-xs font-semibold text-brand-600 dark:text-brand-400'>
                                    <Calendar size={11} />
                                    {formatDate(latestAppt.date)}
                                </span>
                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.07] text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300'>
                                    <Clock size={11} />
                                    {formatTime(latestAppt.start_time)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* View link */}
                    {latestAppt && (
                        <div className='flex items-center pr-4 sm:pr-5'>
                            <Link
                                to={`/patient/appointments/${latestAppt.id}`}
                                className='hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl hover:text-brand-500 hover:border-brand-200 transition-all'
                            >
                                View <ArrowUpRight size={12} />
                            </Link>
                            <Link to={`/patient/appointments/${latestAppt.id}`} className='absolute inset-0 sm:hidden z-10' aria-label='View appointment' />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Row 2: 3 Stat cards - Static 3-column grid on all screens ── */}
            <div className='grid grid-cols-3 gap-2 sm:gap-4'>
                <StatCard
                    title='Pending'
                    value={loading ? '…' : pendingCount.toString()}
                    icon={AlertCircle}
                    color='warning'
                />
                <StatCard
                    title='Approved'
                    value={loading ? '…' : approvedCount.toString()}
                    icon={CheckCircle2}
                    color='success'
                />
                <StatCard
                    title='Waitlist'
                    value={loading ? '…' : waitlistCount.toString()}
                    icon={ClipboardList}
                    color='info'
                />
            </div>

        </div>
    );
};

export default DashboardStats;
