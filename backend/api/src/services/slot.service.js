import { supabaseAdmin } from '../config/supabase.js';
import { CLINIC_CONFIG } from '../utils/constants.js';

/**
 * Get available time slots for a given date and service.
 *
 * @param {string} date - Format: 'YYYY-MM-DD' (e.g., '2026-03-01')
 * @param {string} serviceId - The service UUID
 * @returns {object} { available_slots: ['08:00', '08:30', ...], date, service }
 */

/*
SAMPLE DATA THAT WILL BE RETURNED
{
  "available_slots": ["08:00", "08:30", "09:00"],  // All free time slots
  "date": "2026-03-01",                             // The date you checked
  "service": "Teeth Cleaning",                      // Name of the service
  "duration_minutes": 30,                           // Service duration in minutes
  "total_available": 3                               // Number of slots
}
*/

export const getAvailableSlots = async (date, serviceId) => {
    // ── 1. Get the service to know its duration ──
    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        throw { status: 404, message: 'Service not found.' };
    }

    const durationMinutes = service.duration_minutes;

    // ── 2. Check if the clinic is open on that day ──
    const dayOfWeek = new Date(date).getDay(); // 0=Sun, 1=Mon, ...

    const { data: clinicDay } = await supabaseAdmin
        .from('clinic_schedule')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .single();

    if (!clinicDay || !clinicDay.is_open) {
        return {
            available_slots: [],
            date,
            service: service.name,
            message: 'Clinic is closed on this day.',
        };
    }

    // ── 3. Get all active dentists who work on that day ──
    const { data: dentists } = await supabaseAdmin
        .from('dentists')
        .select('id, profile_id')
        .eq('is_active', true);

    if (!dentists || dentists.length === 0) {
        return {
            available_slots: [],
            date,
            service: service.name,
            message: 'No dentists available.',
        };
    }

    const dentistIds = dentists.map((d) => d.id);

    // Get each dentist's schedule for that day
    const { data: dentistSchedules } = await supabaseAdmin
        .from('dentist_schedule')
        .select('*')
        .in('dentist_id', dentistIds)
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

    if (!dentistSchedules || dentistSchedules.length === 0) {
        return {
            available_slots: [],
            date,
            service: service.name,
            message: 'No dentists working on this day.',
        };
    }

    // ── 4. Check dentist availability blocks (leave, sick, etc.) ──
    const { data: blocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('dentist_id')
        .eq('block_date', date);

    const blockedDentistIds = (blocks || []).map((b) => b.dentist_id);

    // Filter out blocked dentists from schedules
    const activeSchedules = dentistSchedules.filter(
        (s) => !blockedDentistIds.includes(s.dentist_id),
    );

    if (activeSchedules.length === 0) {
        return {
            available_slots: [],
            date,
            service: service.name,
            message: 'No dentists available on this day (blocked/on leave).',
        };
    }

    // ── 5. Get existing appointments on that date (not cancelled) ──
    const { data: existingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('dentist_id, start_time, end_time')
        .eq('appointment_date', date)
        .not('status', 'in', '("CANCELLED","LATE_CANCEL","WAITLISTED")');

    // ── 6. For each dentist, calculate their available slots ──
    const allAvailableSlots = new Set(); // Using Set to avoid duplicates

    for (const schedule of activeSchedules) {
        const dentistId = schedule.dentist_id;
        const startTime = schedule.start_time;
        const endTime = schedule.end_time;

        // Generate all possible slots for this dentist
        const possibleSlots = generateTimeSlots(startTime, endTime, durationMinutes);

        // Filter out slots that conflict with existing appointments
        const dentistAppointments = (existingAppointments || []).filter(
            (a) => a.dentist_id === dentistId,
        );

        const freeSlots = possibleSlots.filter((slot) => {
            const slotEnd = addMinutes(slot, durationMinutes);
            // Check if this slot overlaps with any existing appointment
            return !dentistAppointments.some((appt) =>
                timesOverlap(slot, slotEnd, appt.start_time, appt.end_time),
            );
        });

        // Add free slots to the combined set
        freeSlots.forEach((slot) => allAvailableSlots.add(slot));
    }

    // ── 6. Sort and return ──
    const sortedSlots = Array.from(allAvailableSlots).sort();

    return {
        available_slots: sortedSlots,
        date,
        service: service.name,
        duration_minutes: durationMinutes,
        total_available: sortedSlots.length,
    };
};

/**
 * Get suggested alternative slots when the requested time is not available.
 * Looks at the same day and nearby days.
 */

/*
SAMPLE DATA THAT WILL BE RETURNED
{
  same_day_alternatives: [
    { time: "13:30", date: "2026-02-20", diff: 30 },
    { time: "15:00", date: "2026-02-20", diff: 60 },
    { time: "16:00", date: "2026-02-20", diff: 120 },
    { time: "11:00", date: "2026-02-20", diff: 180 },
    { time: "10:00", date: "2026-02-20", diff: 240 }
  ],
  next_days_alternatives: [
    { time: "14:30", date: "2026-02-21", diff: 30 },
    { time: "15:30", date: "2026-02-21", diff: 90 },
    { time: "09:00", date: "2026-02-21", diff: 300 },
    { time: "14:15", date: "2026-02-22", diff: 15 },
    { time: "13:00", date: "2026-02-22", diff: 60 },
    { time: "12:00", date: "2026-02-22", diff: 120 },
    { time: "14:45", date: "2026-02-23", diff: 45 },
    { time: "11:30", date: "2026-02-23", diff: 150 },
    { time: "10:30", date: "2026-02-23", diff: 210 }
  ],
  message: "The requested slot is not available. Here are alternatives:"
}
*/

export const getSuggestedSlots = async (date, serviceId, requestedTime) => {
    // Get slots for the same day
    const sameDayResult = await getAvailableSlots(date, serviceId);

    // Find nearby times (closest to what they wanted)
    const nearbySlots = sameDayResult.available_slots
        .map((slot) => ({
            time: slot,
            date: date,
            diff: Math.abs(timeToMinutes(slot) - timeToMinutes(requestedTime)),
        }))
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 5); // Top 5 closest times

    // Also check next 3 days
    const nextDaySlots = [];
    for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + i);
        const dateStr = nextDate.toISOString().split('T')[0];

        try {
            const result = await getAvailableSlots(dateStr, serviceId);
            if (result.available_slots.length > 0) {
                // Find slots near the requested time on that day
                const nearSlots = result.available_slots
                    .map((slot) => ({
                        time: slot,
                        date: dateStr,
                        diff: Math.abs(timeToMinutes(slot) - timeToMinutes(requestedTime)),
                    }))
                    .sort((a, b) => a.diff - b.diff)
                    .slice(0, 3);

                nextDaySlots.push(...nearSlots);
            }
        } catch (e) {
            // Skip days that error
        }
    }

    return {
        same_day_alternatives: nearbySlots,
        next_days_alternatives: nextDaySlots,
        message: 'The requested slot is not available. Here are alternatives:',
    };
};

// ──────────────────────────────────────────────────
// HELPER FUNCTIONS (used only in this file)
// ──────────────────────────────────────────────────

/**
 * Generate time slots between start and end with given interval.
 * Example: generateTimeSlots('08:00', '12:00', 30)
 *   → ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
 */
function generateTimeSlots(startTime, endTime, intervalMinutes) {
    const slots = [];
    let currentMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime) - intervalMinutes; // Last slot must END before closing

    while (currentMinutes <= endMinutes) {
        slots.push(minutesToTime(currentMinutes));
        currentMinutes += intervalMinutes;
    }

    return slots;
}

/**
 * Check if two time ranges overlap.
 * Example: timesOverlap('09:00', '09:30', '09:00', '09:30') → true (exact same time)
 * Example: timesOverlap('09:00', '09:30', '09:30', '10:00') → false (back to back is OK)
 */
function timesOverlap(start1, end1, start2, end2) {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return s1 < e2 && s2 < e1;
}

/**
 * Convert "HH:MM" or "HH:MM:SS" string to total minutes since midnight.
 * Example: timeToMinutes('09:30') → 570
 */
function timeToMinutes(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Convert minutes since midnight to "HH:MM" string.
 * Example: minutesToTime(570) → '09:30'
 */
function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, '0');
    const mins = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}

/**
 * Add minutes to a time string.
 * Example: addMinutes('09:00', 30) → '09:30'
 */
function addMinutes(timeStr, minutes) {
    return minutesToTime(timeToMinutes(timeStr) + minutes);
}
