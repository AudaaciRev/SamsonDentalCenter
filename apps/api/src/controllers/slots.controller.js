import { getAvailableSlots, getSuggestedSlots, getServiceAvailabilityStatus } from '../services/slot.service.js';

// ── FOR GUESTS (no auth) ──
export const getSuggestionsPublic = async (req, res, next) => {
    try {
        const { date, service_id, time } = req.query;
        const result = await getSuggestedSlots(date, service_id, time);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// ── FOR GUESTS (no auth) ──
export const getAvailablePublic = async (req, res, next) => {
    try {
        const { date, service_id, session_id, dentist_id, exclude_appointment_id } = req.query;

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        const result = await getAvailableSlots(
            date,
            service_id,
            session_id,
            false,
            dentist_id,
            exclude_appointment_id
        );
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/slots/available?date=2026-03-01&service_id=xxx
 */
export const getAvailable = async (req, res, next) => {
    try {
        const { date, service_id, session_id, dentist_id, exclude_appointment_id } = req.query;

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        const result = await getAvailableSlots(
            date,
            service_id,
            session_id,
            false,
            dentist_id,
            exclude_appointment_id
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/slots/suggest?date=2026-03-01&service_id=xxx&time=09:00
 */
export const getSuggestions = async (req, res, next) => {
    try {
        const { date, service_id, time } = req.query;
        const result = await getSuggestedSlots(date, service_id, time);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/slots/service-status/:serviceId
 *
 * Check if a service is bookable (has doctors and slots).
 */
export const checkServiceStatus = async (req, res, next) => {
    try {
        const { serviceId } = req.params;
        const { dentistId } = req.query;
        const result = await getServiceAvailabilityStatus(serviceId, dentistId);
        
        // TEMPORARY DEBUG: Also test what happens natively
        const debugDate = new Date().toISOString().split('T')[0];
        const debugNext = await getServiceAvailabilityStatus(serviceId, dentistId);
        
        console.log("=== CHECK SERVICE STATUS ===");
        console.log(`Service: ${serviceId}, Dentist: ${dentistId}`);
        console.log(`Result:`, debugNext);
        console.log("============================");

        res.json(result);
    } catch (err) {
        next(err);
    }
};
