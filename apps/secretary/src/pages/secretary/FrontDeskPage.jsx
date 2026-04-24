import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { UserCheck, CheckCircle2, MapPin, X, CalendarClock, CalendarDays } from 'lucide-react';

const ProgressCheckIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Solid right arc */}
        <path d="M12 3a9 9 0 0 1 0 18" />
        {/* Dashed left arc */}
        <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9" strokeDasharray="4 5" />
        {/* Center check */}
        <path d="M8 12l3 3 5-5" />
    </svg>
);

const mockFrontDeskAppointments = [
    {
        id: 1,
        status: 'Upcoming',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        service: 'Routine Cleaning',
        patient: 'Christopher Picarding',
        patientAvatar: 'https://ui-avatars.com/api/?name=Christopher+Picarding&background=random',
        doctor: 'Dr. James Thompson',
        doctorAvatar: 'https://ui-avatars.com/api/?name=James+Thompson&background=random',
        specialty: 'General Dentistry',
        phone: '+63 917 123 4567',
    },
    {
        id: 2,
        status: 'In Progress',
        startTime: '10:30 AM',
        endTime: '11:30 AM',
        service: 'Orthodontic Checkup',
        patient: 'Sarah Mitchell',
        patientAvatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=random',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 920 987 6543',
    },
    {
        id: 3,
        status: 'Upcoming',
        startTime: '1:00 PM',
        endTime: '2:00 PM',
        service: 'Tooth Extraction',
        patient: 'James Wilson',
        patientAvatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=random',
        doctor: 'Dr. Alan Smith',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Alan+Smith&background=random',
        specialty: 'Oral Surgery',
        phone: '+63 932 555 7890',
    },
    {
        id: 4,
        status: 'Completed',
        startTime: '8:00 AM',
        endTime: '9:00 AM',
        service: 'Initial Consultation',
        patient: 'Michael Scott',
        patientAvatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=random',
        doctor: 'Dr. Emily Chen',
        doctorAvatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random',
        specialty: 'Specialized Dentistry',
        phone: '+63 999 111 2222',
    }
];

const FrontDeskPage = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');

    const filteredAppointments = mockFrontDeskAppointments.filter(apt => apt.status === activeTab);
   
    // Calculate counts
    const upcomingCount = mockFrontDeskAppointments.filter(apt => apt.status === 'Upcoming').length;
    const inProgressCount = mockFrontDeskAppointments.filter(apt => apt.status === 'In Progress').length;
    const completedCount = mockFrontDeskAppointments.filter(apt => apt.status === 'Completed').length;

    return (
        <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden pb-10">
            <PageBreadcrumb pageTitle="Front Desk" />
           
            <div className="mt-6 sm:mt-8 flex flex-col">
                <h1 className="text-[clamp(1.75rem,4vw+1rem,2.5rem)] font-bold font-outfit tracking-tight text-[#0B1120] dark:text-white leading-tight">
                    Check-in / Check-out
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-[clamp(0.9rem,2vw+0.5rem,1.125rem)]">
                    Manage patient arrivals and departures.
                </p>
            </div>

            {/* Tabs & Date Selection Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 dark:border-gray-800 mt-8 sm:mt-10 gap-4 sm:gap-6 md:gap-0">
               
                {/* Tabs */}
                <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar w-full md:w-auto shrink-0 pb-1">
                    <button
                        onClick={() => setActiveTab('Upcoming')}
                        className={`flex items-center gap-2 sm:gap-2.5 pb-3 sm:pb-4 px-1 sm:px-2 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'Upcoming'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <CalendarClock size={20} className={`shrink-0 ${activeTab === 'Upcoming' ? 'text-blue-600 dark:text-blue-500' : 'text-blue-600/70 dark:text-blue-500/70'}`} />
                        <span className="font-bold text-[clamp(1rem,2vw+0.5rem,1.125rem)]">Upcoming</span>
                        <span className={`ml-1 sm:ml-2 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                            activeTab === 'Upcoming'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
                        }`}>
                            {upcomingCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('In Progress')}
                        className={`flex items-center gap-2 sm:gap-2.5 pb-3 sm:pb-4 px-1 sm:px-2 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'In Progress'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <ProgressCheckIcon size={20} className={`shrink-0 ${activeTab === 'In Progress' ? 'text-amber-500' : 'text-amber-500/70'}`} />
                        <span className="font-bold text-[clamp(1rem,2vw+0.5rem,1.125rem)]">In Progress</span>
                        <span className={`ml-1 sm:ml-2 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                            activeTab === 'In Progress'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400/70'
                        }`}>
                            {inProgressCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('Completed')}
                        className={`flex items-center gap-2 sm:gap-2.5 pb-3 sm:pb-4 px-1 sm:px-2 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'Completed'
                            ? 'border-brand-500 text-[#0B1120] dark:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <CheckCircle2 size={20} className={`shrink-0 ${activeTab === 'Completed' ? 'text-emerald-500' : 'text-emerald-500/70'}`} />
                        <span className="font-bold text-[clamp(1rem,2vw+0.5rem,1.125rem)]">Completed</span>
                        <span className={`ml-1 sm:ml-2 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                            activeTab === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400/70'
                        }`}>
                            {completedCount}
                        </span>
                    </button>
                </div>

                {/* Date Selection */}
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-[13px] sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4 md:mb-2 shadow-sm w-fit">
                    <CalendarDays size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="truncate">Today, 25 Apr 2026</span>
                </div>
            </div>

            {/* Appointment Cards */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(apt => (
                        <div key={apt.id} className="flex flex-col md:flex-row bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                           
                            {/* Left Time Column */}
                            <div className="flex flex-row md:flex-col w-full md:w-[140px] lg:w-[160px] bg-gray-50/50 dark:bg-gray-800/20 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 shrink-0">
                                <div className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4 border-r md:border-r-0 md:border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">Start Time</span>
                                    <span className="text-[clamp(0.875rem,2vw,1.125rem)] font-bold text-[#0B1120] dark:text-white font-outfit truncate">{apt.startTime}</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-4">
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">End Time</span>
                                    <span className="text-[clamp(0.875rem,2vw,1.125rem)] font-semibold text-gray-500 dark:text-gray-400 font-outfit truncate">{apt.endTime}</span>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 sm:p-5 md:p-6 lg:px-8 gap-5 sm:gap-6 lg:gap-8 min-w-0 w-full">
                               
                                {/* Patient Info */}
                                <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[240px] xl:min-w-[280px] shrink-0">
                                    <div className="relative shrink-0">
                                        <img src={apt.patientAvatar} alt={apt.patient} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover" />
                                        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-[#0B1120] dark:text-white text-[clamp(1rem,2vw,1.25rem)] font-outfit group-hover:text-brand-500 transition-colors truncate">
                                            {apt.patient}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium mt-0.5">
                                            Patient
                                        </span>
                                    </div>
                                </div>

                                {/* Appointment Details (Grid to maximize horizontal space) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-6 w-full lg:flex-1 min-w-0">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">Service</span>
                                        <span className="text-[13px] sm:text-[15px] font-bold text-[#0B1120] dark:text-white truncate" title={apt.service}>{apt.service}</span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">Doctor</span>
                                        <span className="text-[13px] sm:text-[15px] font-semibold text-gray-700 dark:text-gray-300 truncate" title={apt.doctor}>{apt.doctor}</span>
                                    </div>
                                    <div className="flex flex-col sm:col-span-2 xl:col-span-1 min-w-0">
                                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 sm:mb-1">Contact Number</span>
                                        <span className="text-[13px] sm:text-[15px] font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 truncate" title={apt.phone}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone text-emerald-500 shrink-0 sm:w-[18px] sm:h-[18px]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                            <span className="truncate">{apt.phone}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end w-full lg:w-auto mt-2 sm:mt-0 shrink-0">
                                    {apt.status === 'Completed' ? (
                                        <button className="w-full lg:w-auto px-6 sm:px-10 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[14px] sm:text-base font-bold rounded-xl shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95">
                                            View Details
                                        </button>
                                    ) : (
                                        <button className={`w-full lg:w-auto px-6 sm:px-10 py-3 text-white text-[14px] sm:text-base font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 ${
                                            apt.status === 'Upcoming'
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : 'bg-emerald-500 hover:bg-emerald-600'
                                        }`}>
                                            {apt.status === 'Upcoming' ? 'Check In' : 'Check Out'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 sm:p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl">
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-[clamp(0.875rem,2vw,1rem)]">No appointments in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrontDeskPage;
