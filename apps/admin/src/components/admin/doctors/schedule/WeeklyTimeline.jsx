import React, { useState } from 'react';
import { format, addDays, startOfDay, addMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarOff } from 'lucide-react';
import { Button } from '../../../ui';

// 8 AM to 5 PM in 30min intervals
const TIMES = [];
for (let h = 8; h <= 17; h++) {
    TIMES.push(`${h}:00`);
    TIMES.push(`${h}:30`);
}

const WeeklyTimeline = ({ doctor }) => {
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    // Sample Data: Blocked times and appointments (mocked for demo)
    const events = [
        {
            id: 1,
            type: 'appointment',
            label: 'Cleaning - John Doe',
            start: addMinutes(addDays(startOfDay(new Date()), 0), 9 * 60 + 30), // Today 9:30 AM
            duration: 45,
            color: '#38bdf8'
        },
        {
            id: 2,
            type: 'blocked',
            label: 'Lunch Break',
            start: addMinutes(addDays(startOfDay(new Date()), 0), 12 * 60), // Today 12:00 PM
            duration: 60,
            color: '#64748b'
        },
        {
            id: 3,
            type: 'appointment',
            label: 'Root Canal - Jane Smith',
            start: addMinutes(addDays(startOfDay(new Date()), 1), 10 * 60), // Tomorrow 10:00 AM
            duration: 90,
            color: '#818cf8'
        }
    ];

    const getEventStyle = (event) => {
        const startHour = event.start.getHours();
        const startMinutes = event.start.getMinutes();
        
        // Grid starts at 8 AM. Each 30min slot is 40px high (80px per hour)
        // Added 20px top offset for the half-row spacer that prevents label cutoff
        const top = (startHour - 8) * 80 + (startMinutes / 60) * 80 + 20;
        const height = (event.duration / 60) * 80;

        return {
            top: `${top}px`,
            height: `${height - 2}px`, 
            backgroundColor: event.type === 'blocked' ? '#f8fafc' : `${event.color}15`,
            borderLeft: `3px solid ${event.type === 'blocked' ? '#94a3b8' : event.color}`,
            color: event.type === 'blocked' ? '#475569' : event.color,
            borderColor: event.type === 'blocked' ? '#e2e8f0' : `${event.color}30`
        };
    };

    const nav = (days) => setStartDate(addDays(startDate, days));
    const goToday = () => setStartDate(startOfDay(new Date()));

    return (
        <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-white/[0.03]">
            {/* Main Header: Title & Block Action (Matches WeeklyRoutine) */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Upcoming Schedule
                    </h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        Timeline view of appointments and manual blocks for the next 7 days.
                    </p>
                </div>
                <div className='hidden sm:flex items-center gap-3'>
                    <Button 
                        variant="soft" 
                        className="text-sm font-bold h-10 px-4 flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                        <CalendarOff size={16} />
                        Block Time
                    </Button>
                </div>
            </div>

            {/* Grid Wrapper */}
            <div className="flex flex-col h-auto overflow-x-auto no-scrollbar">
                
                {/* Grid Header: Date Range & Nav (Matches WeeklyRoutine Month Nav) */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.01] gap-4 min-w-[700px]'>
                    <div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                            Week of {format(startDate, 'MMMM d, yyyy')}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={goToday} className="text-xs font-bold px-3 h-8 border-gray-200 dark:border-gray-700">Today</Button>
                        <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => nav(-7)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-500 transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => nav(7)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-500 transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Day Headers row - Synchronized width and grid */}
                <div className="grid border-b border-gray-300 dark:border-gray-700 bg-gray-50/20 dark:bg-transparent min-w-[700px]"
                    style={{ gridTemplateColumns: `80px repeat(7, 1fr)` }}>
                    <div className="border-r border-gray-300 dark:border-gray-700" />
                    {dates.map((date, i) => {
                        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                            <div key={i} className={`flex flex-col items-start justify-start p-2 sm:p-3 border-r border-gray-300 dark:border-gray-700 last:border-r-0 ${isToday ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}>
                                <span className={`text-sm sm:text-lg font-black ${isToday ? 'text-brand-500' : 'text-gray-900 dark:text-white'}`}>
                                    {format(date, 'd')}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isToday ? 'text-brand-500 opacity-80' : 'text-gray-400'}`}>
                                    {format(date, 'EEE')}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Timeline Body */}
                <div className="no-scrollbar min-w-[700px] pb-10">
                    <div className="grid relative"
                        style={{ 
                            gridTemplateColumns: `80px repeat(7, 1fr)`,
                            // 20px spacer row + grid rows
                            gridTemplateRows: `20px repeat(${TIMES.length - 1}, 40px)` 
                        }}>
                        
                        {/* 1. Time Gutter (Column 1) */}
                        <div className="grid border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50" 
                             style={{ gridColumn: 1, gridRow: `1 / span ${TIMES.length}` }}>
                            
                            {/* Top Spacer Cell (Ensures first label isn't cut off) */}
                            <div className="h-5" /> 

                            {TIMES.map((time, i) => {
                                const [h, m] = time.split(':').map(Number);
                                const isHalf = m !== 0;
                                return (
                                    <div key={i} className="flex justify-center items-start h-10 relative">
                                        {/* Line Alignment: Labels formatted to h:mm a */}
                                        <span className={`absolute top-0 text-[10px] font-black tabular-nums transform -translate-y-1/2 ${isHalf ? 'text-gray-400 opacity-60' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {format(new Date().setHours(h, m), isHalf ? 'h:mm a' : 'h a')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 2. Grid Cells and Data Columns (Columns 2-8) */}
                        {dates.map((date, colIndex) => (
                            <div key={colIndex} 
                                 className="relative border-r border-gray-300 dark:border-gray-700 last:border-r-0"
                                 style={{ gridColumn: colIndex + 2, gridRow: `1 / span ${TIMES.length}` }}>
                                
                                {/* Top Spacer Grid Cell */}
                                <div className="h-5 border-b border-transparent" />

                                {/* 30min Background Slots - Aligned perfectly with labels */}
                                {TIMES.slice(0, -1).map((_, rowIndex) => (
                                    <div key={rowIndex} className={`h-10 border-b border-gray-300 dark:border-gray-700 ${rowIndex % 2 === 1 ? 'opacity-40' : 'opacity-100'}`} />
                                ))}

                                {/* Event Pills Overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {events
                                        .filter(e => startOfDay(e.start).getTime() === date.getTime())
                                        .map(event => (
                                            <div 
                                                key={event.id}
                                                className="absolute left-[6px] right-[6px] p-2 rounded-lg border shadow-sm flex flex-col gap-0.5 pointer-events-auto z-10 transition-all hover:ring-2 hover:ring-offset-1 dark:hover:ring-offset-gray-900 overflow-hidden"
                                                style={{...getEventStyle(event)}}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[8px] font-black uppercase tracking-tighter truncate opacity-80">
                                                        {format(event.start, 'h:mm a')}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold leading-tight line-clamp-2">
                                                    {event.label}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyTimeline;
