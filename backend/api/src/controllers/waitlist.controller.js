import {
    joinWaitlist,
    getMyWaitlist,
    cancelWaitlistEntry,
    confirmWaitlistOffer,
} from '../services/waitlist.service.js';
import { bookAppointment } from '../services/appointment.service.js';

/**
 * POST /api/waitlist/join
 * Body: { service_id, date, time?, priority? }
 */
export const join = async (req, res, next) => {
    try {
        const { service_id, date, time, priority } = req.body;

        if (!service_id || !date) {
            return res.status(400).json({ error: 'service_id and date are required.' });
        }

        const result = await joinWaitlist(req.user.id, service_id, date, time, priority);
        res.status(201).json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/waitlist/my
 */
export const getMine = async (req, res, next) => {
    try {
        const entries = await getMyWaitlist(req.user.id);
        res.json({ waitlist: entries, total: entries.length });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * DELETE /api/waitlist/:id
 */
export const remove = async (req, res, next) => {
    try {
        const result = await cancelWaitlistEntry(req.params.id, req.user.id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * POST /api/waitlist/:id/confirm
 * Patient confirms they want the offered slot.
 *
 * Flow:
 * 1. confirmWaitlistOffer() validates, checks expiry, handles swap + cleanup
 * 2. If confirmed + we have a time → auto-book via bookAppointment()
 * 3. If no time → tell patient to pick a slot
 */
export const confirm = async (req, res, next) => {
    try {
        // 1. Confirm the waitlist offer (handles expiry cascade, swap, cleanup)
        const result = await confirmWaitlistOffer(req.params.id, req.user.id);

        if (!result.confirmed) {
            return res.json(result);
        }

        // 2. If confirmed and we have a specific time, auto-book the appointment
        if (result.time) {
            const booking = await bookAppointment(
                req.user.id,
                result.service_id,
                result.date,
                result.time,
            );
            return res.json({
                message: result.swapped
                    ? `Appointment swapped! Old (${result.swapped_from}) cancelled, new booked.`
                    : 'Waitlist confirmed and appointment booked!',
                swapped: result.swapped,
                ...booking,
            });
        }

        // 3. If no specific time, tell them to pick a slot
        res.json({
            message: 'Waitlist confirmed! Please select an available time slot.',
            service_id: result.service_id,
            date: result.date,
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
