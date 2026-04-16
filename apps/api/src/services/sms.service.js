import { AppError } from '../utils/errors.js';

/**
 * FortMed SMS Service
 */

const FORTMED_API_KEY = process.env.FORTMED_API_KEY || 'fmcsms_dcc20386a5d1d3350de35cb55103eb722dc2d59ff4841ddb';
const FORTMED_SENDER_NAME = process.env.FORTMED_SENDER_NAME || 'Samson Dental Center';
const FORTMED_FROM_NUMBER = process.env.FORTMED_FROM_NUMBER || '+639171234567'; // Default sender number if required
const FORTMED_API_URL = 'https://www.fortmed.org/web/FMCSMS/api/messages.php';

console.log('[SMS Service] Initialization Status:', {
    apiKeyPresent: !!FORTMED_API_KEY,
    senderName: FORTMED_SENDER_NAME,
    endpoint: FORTMED_API_URL
});

/**
 * Send an SMS via FortMed.
 * 
 * @param {string} to - Recipient phone number (e.g., +639XXXXXXXXX)
 * @param {string} message - Message content
 * @returns {Promise<object>} - FortMed API response
 */
export const sendSMS = async (to, message) => {
    if (!FORTMED_API_KEY) {
        console.warn('[SMS] Skipping SMS send: FORTMED_API_KEY not configured.');
        return { success: false, reason: 'unconfigured' };
    }

    if (!to) {
        throw new AppError('Recipient phone number is required.', 400);
    }

    // Ensure number is in +63 format for FortMed if necessary, or keep as is
    let cleanTo = to.trim();
    if (!cleanTo.startsWith('+')) {
        if (cleanTo.startsWith('0')) {
            cleanTo = '+63' + cleanTo.substring(1);
        } else if (cleanTo.startsWith('63')) {
            cleanTo = '+' + cleanTo;
        }
    }

    try {
        console.log(`[SMS] Sending to ${cleanTo}: "${message.substring(0, 50)}..."`);

        const payload = {
            SenderName: FORTMED_SENDER_NAME,
            ToNumber: cleanTo,
            MessageBody: message,
            FromNumber: FORTMED_FROM_NUMBER,
        };

        console.log('[SMS] Payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(FORTMED_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': FORTMED_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`📱 [SMS] SUCCESS: Message sent to ${cleanTo}`);
            return { success: true, ...result };
        } else {
            console.error(`📱 [SMS] API ERROR: ${response.status} - ${JSON.stringify(result)}`);
            return { success: false, status: response.status, ...result };
        }
    } catch (err) {
        console.error(`📱 [SMS] ERROR: ${err.message}`);
        return { success: false, error: err.message };
    }
};

