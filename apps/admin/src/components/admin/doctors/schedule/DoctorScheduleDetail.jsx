import React, { useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import WeeklyRoutine from './WeeklyRoutine';
import WeeklyTimeline from './WeeklyTimeline';
import BlockTimeModal from './BlockTimeModal';
import { useToast } from '../../../../context/ToastContext.jsx';
import { useDoctors } from '../../../../hooks/useDoctors';

const DoctorScheduleDetail = ({ doctor }) => {
    const { showToast } = useToast();
    const { fetchDoctorAppointments, fetchDoctorBlocks } = useDoctors(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isTimeBlockModalOpen, setIsTimeBlockModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [events, setEvents] = useState([]);

    const loadCalendarData = useCallback(async () => {
        if (!doctor?.id) return;
        try {
            setIsLoading(true);
            const [fetchedAppointments, fetchedBlocks] = await Promise.all([
                fetchDoctorAppointments(doctor.id),
                fetchDoctorBlocks(doctor.id)
            ]);

            const newEvents = [];

            // 1. Map Appointments
            fetchedAppointments.forEach(appt => {
                // Calculate duration in minutes
                const start = new Date(`1970-01-01T${appt.start_time}`);
                const end = new Date(`1970-01-01T${appt.end_time}`);
                const duration = (end - start) / (1000 * 60);

                newEvents.push({
                    id: appt.id,
                    date: appt.appointment_date,
                    start: appt.start_time.substring(0, 5),
                    duration: duration,
                    service: appt.service?.name || 'Dental Service',
                    patient: appt.patient?.full_name || 'Guest Patient',
                    type: 'appointment',
                    status: appt.status
                });
            });

            // 2. Mapping Blocks
            fetchedBlocks.forEach(block => {
                const dateKey = block.block_date.substring(0, 10);
                
                // If no times specified, it's a full day block. 
                // We map it to fit the visible timeline (08:00 - 18:00) to ensure visibility.
                const isFullDay = !block.start_time;
                const startTime = isFullDay ? '08:00' : block.start_time.substring(0, 5);
                const endTime = isFullDay ? '18:00' : (block.end_time ? block.end_time.substring(0, 5) : '18:00');
                
                const startObj = new Date(`1970-01-01T${startTime}`);
                const endObj = new Date(`1970-01-01T${endTime}`);
                const duration = (endObj - startObj) / (1000 * 60);

                newEvents.push({
                    id: block.id,
                    date: dateKey,
                    start: startTime,
                    duration: duration,
                    service: block.reason || 'Blocked',
                    patient: 'Clinical Staff',
                    type: 'blocked'
                });
            });

            setEvents(newEvents);
        } catch (err) {
            console.error('Failed to load calendar events:', err);
            showToast('Could not load calendar events.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [doctor?.id, fetchDoctorAppointments, fetchDoctorBlocks]);

    useEffect(() => {
        loadCalendarData();
    }, [loadCalendarData]);

    const handleApplyTimeBlocks = (date, blockedSlots, unblockedSlots, reason) => {
        // Since we are now dynamic, we refresh the calendar after save
        // The saving itself is handled in WeeklyRoutine for date blocks, 
        // or a separate modal for time blocks.
        loadCalendarData();
    };

    return (
        <div className={`flex flex-col gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-gray-900/20 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Syncing Schedule...</span>
                    </div>
                </div>
            )}
            {/* Top row: The main weekly form */}
            <div className='w-full'>
                <WeeklyRoutine 
                    doctor={doctor} 
                    externalBlockModalOpen={isBlockModalOpen}
                    setExternalBlockModalOpen={setIsBlockModalOpen}
                />
            </div>

            {/* Bottom row: Weekly Timeline view */}
            <div className='w-full'>
                <WeeklyTimeline 
                    doctor={doctor} 
                    events={events}
                    onBlockClick={() => setIsTimeBlockModalOpen(true)}
                />
            </div>

            <BlockTimeModal 
                isOpen={isTimeBlockModalOpen}
                onClose={() => setIsTimeBlockModalOpen(false)}
                events={events}
                onSave={handleApplyTimeBlocks}
            />
        </div>
    );
};

export default DoctorScheduleDetail;

