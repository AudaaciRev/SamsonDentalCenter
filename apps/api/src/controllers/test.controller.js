/**
 * 🧪 TEST CONTROLLER
 *
 * DEBUG endpoints for testing email sending and other features.
 * Remove before production!
 */

import {
    testSend24hReminder,
    testSend48hReminder,
    testSendGuestReminder,
} from '../utils/scheduled-tasks.js';
import { createGuestActionTokens } from '../services/email-confirmation.service.js';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * 🧪 GET /api/test/reminder/24h/:appointmentId
 *
 * Send 24h reminder email immediately for an authenticated patient
 */
export const test24hReminder = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ error: 'appointmentId is required' });
        }

        const result = await testSend24hReminder(appointmentId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Test 24h reminder error:', err);
        next(err);
    }
};

/**
 * 🧪 GET /api/test/reminder/48h/:appointmentId
 *
 * Send 48h reminder email immediately for an authenticated patient
 */
export const test48hReminder = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ error: 'appointmentId is required' });
        }

        const result = await testSend48hReminder(appointmentId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Test 48h reminder error:', err);
        next(err);
    }
};

/**
 * 🧪 GET /api/test/reminder/guest/:appointmentId
 *
 * Send guest reminder email with action tokens immediately
 */
export const testGuestReminder = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ error: 'appointmentId is required' });
        }

        const result = await testSendGuestReminder(appointmentId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Test guest reminder error:', err);
        next(err);
    }
};

/**
 * 🧪 GET /api/test/generate-guest-tokens/:appointmentId
 *
 * Generate cancel + reschedule tokens for a guest appointment,
 * and return ready-to-use curl commands for testing the guest routes.
 *
 * No auth needed — this is for testing guest flows.
 */
export const testGenerateGuestTokens = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ error: 'appointmentId is required' });
        }

        // 1. Fetch the appointment
        const { data: appointment, error } = await supabaseAdmin
            .from('appointments')
            .select(
                '*, service:services(id, name, duration_minutes), dentist:dentists(profile:profiles(full_name))',
            )
            .eq('id', appointmentId)
            .single();

        if (error || !appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (!appointment.guest_email) {
            return res.status(400).json({
                error: 'This is not a guest appointment (no guest_email). Use auth endpoints instead.',
            });
        }

        if (appointment.status !== 'CONFIRMED') {
            return res.status(400).json({
                error: `Appointment status is "${appointment.status}". Must be CONFIRMED to generate tokens.`,
            });
        }

        // 2. Generate tokens
        const { cancelToken, rescheduleToken } = await createGuestActionTokens(
            appointment.id,
            appointment.appointment_date,
            appointment.start_time,
        );

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const dentistName = appointment.dentist?.profile?.full_name || 'Assigned';

        // 3. Return tokens + ready-to-use test commands
        res.json({
            success: true,
            message: 'Guest action tokens generated! Use the URLs/commands below to test.',
            appointment: {
                id: appointment.id,
                date: appointment.appointment_date,
                time: appointment.start_time,
                service: appointment.service?.name,
                dentist: dentistName,
                guest_name: appointment.guest_name,
                guest_email: appointment.guest_email,
                status: appointment.status,
            },
            tokens: {
                cancelToken,
                rescheduleToken,
            },
            test_urls: {
                cancel_info: `${baseUrl}/api/appointments/guest/cancel?token=${cancelToken}`,
                cancel_confirm: `${baseUrl}/api/appointments/guest/cancel?token=${cancelToken}`,
                reschedule_info: `${baseUrl}/api/appointments/guest/reschedule?token=${rescheduleToken}`,
                reschedule_confirm: `${baseUrl}/api/appointments/guest/reschedule?token=${rescheduleToken}`,
            },
            test_commands: {
                step1_cancel_info: `curl "${baseUrl}/api/appointments/guest/cancel?token=${cancelToken}"`,
                step2_cancel_confirm: `curl -X POST "${baseUrl}/api/appointments/guest/cancel?token=${cancelToken}"`,
                step1_reschedule_info: `curl "${baseUrl}/api/appointments/guest/reschedule?token=${rescheduleToken}"`,
                step2_reschedule_confirm: `curl -X POST "${baseUrl}/api/appointments/guest/reschedule?token=${rescheduleToken}" -H "Content-Type: application/json" -d "{\\"date\\": \\"${appointment.appointment_date}\\", \\"time\\": \\"10:00\\"}"`,
            },
            instructions: [
                '=== TEST GUEST CANCEL ===',
                'Step 1: GET  /guest/cancel?token=...   → See appointment details (confirmation page)',
                'Step 2: POST /guest/cancel?token=...   → Actually cancel the appointment',
                '',
                '=== TEST GUEST RESCHEDULE ===',
                'Step 1: GET  /guest/reschedule?token=... → See available slots',
                'Step 2: POST /guest/reschedule?token=... + {date, time} → Reschedule to new slot',
                '',
                '⚠️ Cancel token is ONE-TIME USE — once used it cannot be reused.',
                '⚠️ Reschedule token is ONE-TIME USE — once used it cannot be reused.',
                '⚠️ To test again, generate new tokens with this endpoint.',
            ],
        });
    } catch (err) {
        console.error('Test generate guest tokens error:', err);
        next(err);
    }
};
