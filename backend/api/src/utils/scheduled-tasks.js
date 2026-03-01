import cron from 'node-cron';
import { autoDetectNoShows } from '../services/noshow.service.js';
import { sendReminder, send48hConfirmReminder } from '../services/notification.service.js';
import {
    sendGuestReminderEmail,
    sendPatientReminderEmail,
    createGuestActionTokens,
} from '../services/email-confirmation.service.js';
import { supabaseAdmin } from '../config/supabase.js';

// 🧪 DEBUG MODE: Set to true to log emails instead of sending them
const DEBUG_MODE = process.env.DEBUG_SCHEDULED_TASKS === 'true';
if (DEBUG_MODE) {
    console.log('🧪 DEBUG MODE ENABLED - Emails will be logged instead of sent');
}

/**
 * Start all scheduled/cron tasks.
 *
 * Called from server.js after the server starts.
 */
export const startScheduledTasks = () => {
    // ── 1. No-show detection: every 15 min during clinic hours (8am-5pm, Mon-Sat) ──
    cron.schedule('*/15 8-17 * * 1-6', async () => {
        console.log('Running auto no-show detection (15-min grace period)...');
        try {
            const result = await autoDetectNoShows();
            console.log(`   OK ${result.message}`);
        } catch (err) {
            console.error('   Error in no-show detection:', err.message);
        }
    });

    // ── 2. 48h reminders: every day at 8:00 AM ──
    // Patients  -> in-app notification + plain reminder email (no links)
    // Guests    -> reminder email with [Reschedule] [Cancel] action links
    cron.schedule('0 8 * * *', async () => {
        console.log('Sending 48h reminders...');
        try {
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
            const dateStr = dayAfterTomorrow.toISOString().split('T')[0];

            const { data: appointments } = await supabaseAdmin
                .from('appointments')
                .select(
                    '*, service:services(id, name), dentist:dentists(profile:profiles(full_name))',
                )
                .eq('appointment_date', dateStr)
                .eq('status', 'CONFIRMED')
                .eq('reminder_48h_sent', false);

            for (const appt of appointments || []) {
                const dentistName = appt.dentist?.profile?.full_name || 'Assigned';

                if (appt.patient_id) {
                    // ── AUTHENTICATED PATIENT: in-app notification + plain email ──
                    await send48hConfirmReminder(appt.patient_id, {
                        id: appt.id,
                        date: appt.appointment_date,
                        start_time: appt.start_time,
                        service: appt.service?.name,
                    });

                    const { data: patient } = await supabaseAdmin
                        .from('profiles')
                        .select('email, full_name')
                        .eq('id', appt.patient_id)
                        .single();

                    if (patient?.email) {
                        await sendPatientReminderEmail(patient.email, patient.full_name, {
                            date: appt.appointment_date,
                            start_time: appt.start_time,
                            service: appt.service?.name,
                            dentist: dentistName,
                            hoursUntil: 48,
                        });
                    }
                } else if (appt.guest_email) {
                    // ── GUEST: email with [Reschedule] [Cancel] links ──
                    const { cancelToken, rescheduleToken } = await createGuestActionTokens(
                        appt.id,
                        appt.appointment_date,
                        appt.start_time,
                    );

                    await sendGuestReminderEmail(appt.guest_email, appt.guest_name, {
                        date: appt.appointment_date,
                        start_time: appt.start_time,
                        service: appt.service?.name,
                        dentist: dentistName,
                        cancelToken,
                        rescheduleToken,
                        hoursUntil: 48,
                    });
                }

                // Mark reminder as sent (both guest and patient)
                await supabaseAdmin
                    .from('appointments')
                    .update({ reminder_48h_sent: true })
                    .eq('id', appt.id);
            }
            console.log(`   OK Sent ${appointments?.length || 0} 48h reminders.`);
        } catch (err) {
            console.error('   Error in 48h reminder:', err.message);
        }
    });

    // ── 3. 24h reminders: every day at 8:00 AM ──
    // Patients  -> in-app notification + plain reminder email (no links)
    // Guests    -> reminder email with [Reschedule] [Cancel] links (reuse tokens from 48h if they exist)
    cron.schedule('0 8 * * *', async () => {
        console.log('Sending 24h reminders...');
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const { data: appointments } = await supabaseAdmin
                .from('appointments')
                .select(
                    '*, service:services(id, name), dentist:dentists(profile:profiles(full_name))',
                )
                .eq('appointment_date', tomorrowStr)
                .eq('status', 'CONFIRMED');

            for (const appt of appointments || []) {
                const dentistName = appt.dentist?.profile?.full_name || 'Assigned';

                if (appt.patient_id) {
                    // ── AUTHENTICATED PATIENT: in-app notification + plain email ──
                    await sendReminder(
                        appt.patient_id,
                        {
                            date: appt.appointment_date,
                            start_time: appt.start_time,
                            service: appt.service?.name,
                        },
                        24,
                    );

                    const { data: patient } = await supabaseAdmin
                        .from('profiles')
                        .select('email, full_name')
                        .eq('id', appt.patient_id)
                        .single();

                    if (patient?.email) {
                        await sendPatientReminderEmail(patient.email, patient.full_name, {
                            date: appt.appointment_date,
                            start_time: appt.start_time,
                            service: appt.service?.name,
                            dentist: dentistName,
                            hoursUntil: 24,
                        });
                    }
                } else if (appt.guest_email) {
                    // ── GUEST: reuse tokens from 48h job if they exist, else create new ──
                    const { data: existingTokens } = await supabaseAdmin
                        .from('guest_action_tokens')
                        .select('token, action')
                        .eq('appointment_id', appt.id)
                        .is('used_at', null);

                    let cancelToken, rescheduleToken;

                    if (existingTokens && existingTokens.length > 0) {
                        // Tokens already exist from the 48h reminder — reuse them
                        cancelToken = existingTokens.find((t) => t.action === 'cancel')?.token;
                        rescheduleToken = existingTokens.find(
                            (t) => t.action === 'reschedule',
                        )?.token;
                    } else {
                        // No tokens yet (48h reminder was not sent) — create fresh ones
                        const newTokens = await createGuestActionTokens(
                            appt.id,
                            appt.appointment_date,
                            appt.start_time,
                        );
                        cancelToken = newTokens.cancelToken;
                        rescheduleToken = newTokens.rescheduleToken;
                    }

                    await sendGuestReminderEmail(appt.guest_email, appt.guest_name, {
                        date: appt.appointment_date,
                        start_time: appt.start_time,
                        service: appt.service?.name,
                        dentist: dentistName,
                        cancelToken,
                        rescheduleToken,
                        hoursUntil: 24,
                    });
                }
            }
            console.log(`   OK Sent ${appointments?.length || 0} 24h reminders.`);
        } catch (err) {
            console.error('   Error in 24h reminder:', err.message);
        }
    });

    // ── 4. Guest cleanup: every hour — cancel PENDING guests who did not confirm email ──
    cron.schedule('0 * * * *', async () => {
        console.log('Cleaning up expired PENDING guest appointments...');
        try {
            const now = new Date().toISOString();

            const { data: expiredTokens } = await supabaseAdmin
                .from('appointment_confirmation_tokens')
                .select('appointment_id')
                .lt('expires_at', now);

            if (!expiredTokens || expiredTokens.length === 0) {
                console.log('   No expired pending appointments found.');
                return;
            }

            const expiredIds = expiredTokens.map((t) => t.appointment_id);

            const { data: cancelled } = await supabaseAdmin
                .from('appointments')
                .update({
                    status: 'CANCELLED',
                    cancellation_reason: 'Guest did not confirm via email within 24 hours.',
                    cancelled_at: now,
                })
                .in('id', expiredIds)
                .eq('status', 'PENDING')
                .select('id');

            await supabaseAdmin
                .from('appointment_confirmation_tokens')
                .delete()
                .lt('expires_at', now);

            console.log(`   OK Cancelled ${cancelled?.length || 0} expired PENDING appointments.`);
        } catch (err) {
            console.error('   Error in guest cleanup:', err.message);
        }
    });

    console.log('Scheduled tasks started:');
    console.log('   No-show detection: every 15 min (clinic hours)');
    console.log(
        '   48h reminders: daily at 8am (patients: in-app + email | guests: email with links)',
    );
    console.log(
        '   24h reminders: daily at 8am (patients: in-app + email | guests: email with links)',
    );
    console.log('   Guest PENDING cleanup: every hour');
};

/**
 * 🧪 TEST FUNCTION: Send 24h reminder email for an appointment immediately
 *
 * @param {string} appointmentId - The appointment UUID
 * @returns {object} Result with success status and details
 */
export const testSend24hReminder = async (appointmentId) => {
    try {
        const { data: appointment, error } = await supabaseAdmin
            .from('appointments')
            .select('*, service:services(name), dentist:dentists(profile:profiles(full_name))')
            .eq('id', appointmentId)
            .single();

        if (error || !appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.status !== 'CONFIRMED') {
            throw new Error(`Appointment status is ${appointment.status}, must be CONFIRMED`);
        }

        if (!appointment.patient_id) {
            throw new Error('This is a guest appointment. Use testSendGuestReminder instead.');
        }

        // Fetch patient email
        const { data: patient, error: patientError } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name')
            .eq('id', appointment.patient_id)
            .single();

        if (patientError || !patient?.email) {
            throw new Error('Patient email not found');
        }

        const dentistName = appointment.dentist?.profile?.full_name || 'Assigned';

        // Send the reminder
        await sendPatientReminderEmail(patient.email, patient.full_name, {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            service: appointment.service?.name || 'Dental appointment',
            dentist: dentistName,
            hoursUntil: 24,
        });

        return {
            success: true,
            message: `24h reminder sent to ${patient.email}`,
            details: {
                appointmentId,
                patientName: patient.full_name,
                patientEmail: patient.email,
                appointmentDate: appointment.appointment_date,
                appointmentTime: appointment.start_time,
                service: appointment.service?.name,
            },
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            appointmentId,
        };
    }
};

/**
 * 🧪 TEST FUNCTION: Send 48h reminder email for an appointment immediately
 *
 * @param {string} appointmentId - The appointment UUID
 * @returns {object} Result with success status and details
 */
export const testSend48hReminder = async (appointmentId) => {
    try {
        const { data: appointment, error } = await supabaseAdmin
            .from('appointments')
            .select('*, service:services(name), dentist:dentists(profile:profiles(full_name))')
            .eq('id', appointmentId)
            .single();

        if (error || !appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.status !== 'CONFIRMED') {
            throw new Error(`Appointment status is ${appointment.status}, must be CONFIRMED`);
        }

        if (!appointment.patient_id) {
            throw new Error('This is a guest appointment. Use testSendGuestReminder instead.');
        }

        // Fetch patient email
        const { data: patient, error: patientError } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name')
            .eq('id', appointment.patient_id)
            .single();

        if (patientError || !patient?.email) {
            throw new Error('Patient email not found');
        }

        const dentistName = appointment.dentist?.profile?.full_name || 'Assigned';

        // Send the reminder
        await sendPatientReminderEmail(patient.email, patient.full_name, {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            service: appointment.service?.name || 'Dental appointment',
            dentist: dentistName,
            hoursUntil: 48,
        });

        return {
            success: true,
            message: `48h reminder sent to ${patient.email}`,
            details: {
                appointmentId,
                patientName: patient.full_name,
                patientEmail: patient.email,
                appointmentDate: appointment.appointment_date,
                appointmentTime: appointment.start_time,
                service: appointment.service?.name,
            },
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            appointmentId,
        };
    }
};

/**
 * 🧪 TEST FUNCTION: Send guest reminder email with action tokens
 *
 * @param {string} appointmentId - The appointment UUID
 * @returns {object} Result with success status and details
 */
export const testSendGuestReminder = async (appointmentId) => {
    try {
        const { data: appointment, error } = await supabaseAdmin
            .from('appointments')
            .select('*, service:services(name), dentist:dentists(profile:profiles(full_name))')
            .eq('id', appointmentId)
            .single();

        if (error || !appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.status !== 'CONFIRMED') {
            throw new Error(`Appointment status is ${appointment.status}, must be CONFIRMED`);
        }

        if (!appointment.guest_email) {
            throw new Error('This is not a guest appointment. Use testSend24hReminder instead.');
        }

        // Create action tokens
        const { cancelToken, rescheduleToken } = await createGuestActionTokens(
            appointment.id,
            appointment.appointment_date,
            appointment.start_time,
        );

        const dentistName = appointment.dentist?.profile?.full_name || 'Assigned';

        // Send the reminder
        await sendGuestReminderEmail(appointment.guest_email, appointment.guest_name, {
            date: appointment.appointment_date,
            start_time: appointment.start_time,
            service: appointment.service?.name || 'Dental appointment',
            dentist: dentistName,
            cancelToken,
            rescheduleToken,
            hoursUntil: 24,
        });

        return {
            success: true,
            message: `Guest reminder sent to ${appointment.guest_email}`,
            details: {
                appointmentId,
                guestName: appointment.guest_name,
                guestEmail: appointment.guest_email,
                appointmentDate: appointment.appointment_date,
                appointmentTime: appointment.start_time,
                service: appointment.service?.name,
                cancelToken: cancelToken.substring(0, 8) + '...',
                rescheduleToken: rescheduleToken.substring(0, 8) + '...',
            },
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            appointmentId,
        };
    }
};
