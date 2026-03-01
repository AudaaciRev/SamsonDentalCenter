import { supabaseAdmin } from '../config/supabase.js';

/**
 * Auto-assign the best available dentist for a given date and time slot.
 *
 * Strategy: "Least Busy" — pick the dentist with the fewest appointments that day.
 *
 * @param {string} date - 'YYYY-MM-DD'
 * @param {string} startTime - 'HH:MM'
 * @param {string} endTime - 'HH:MM'
 * @returns {string|null} dentist ID or null if nobody is free
 */
export const assignDentist = async (date, startTime, endTime) => {
    const dayOfWeek = new Date(date).getDay();

    // ── 1. Get all dentists who work on this day ──
    const { data: workingDentists } = await supabaseAdmin
        .from('dentist_schedule')
        .select('dentist_id, start_time, end_time')
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

    if (!workingDentists || workingDentists.length === 0) {
        return null; // No dentists working
    }

    // ── 2. Filter: dentist's shift must cover the requested time ──
    const eligibleDentists = workingDentists.filter((ds) => {
        return ds.start_time <= startTime && ds.end_time >= endTime;
    });

    if (eligibleDentists.length === 0) {
        return null; // No dentist covers this time
    }

    // ── 3. Check which of these dentists are NOT booked at this time ──
    const dentistIds = eligibleDentists.map((d) => d.dentist_id);

    const { data: conflictingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL","WAITLISTED")')
        // IMPORTANT: Include PENDING appointments in conflicts!
        // PENDING = unconfirmed but slot is reserved, must not double-book
        .in('dentist_id', dentistIds)
        // Check for time overlap: existing appointment overlaps if
        // it starts before our end AND ends after our start
        .lt('start_time', endTime)
        .gt('end_time', startTime);

    const busyDentistIds = (conflictingAppointments || []).map((a) => a.dentist_id);
    const freeDentists = dentistIds.filter((id) => !busyDentistIds.includes(id));

    if (freeDentists.length === 0) {
        return null; // All dentists booked at this time
    }

    // ── 4. Among free dentists, pick the LEAST BUSY one (fewest total appointments that day) ──
    // IMPORTANT: Include PENDING appointments in the count!
    // They reserve capacity even if unconfirmed
    const { data: dayCounts } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL","WAITLISTED")')
        .in('dentist_id', freeDentists);

    // Count appointments per dentist
    const countMap = {};
    freeDentists.forEach((id) => {
        countMap[id] = 0;
    });
    (dayCounts || []).forEach((a) => {
        if (countMap[a.dentist_id] !== undefined) {
            countMap[a.dentist_id]++;
        }
    });

    // Sort by count (ascending) and pick the first (least busy)
    const sorted = Object.entries(countMap).sort((a, b) => a[1] - b[1]);

    return sorted[0][0]; // Return dentist_id of least busy
};
