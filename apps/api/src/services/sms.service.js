import { AppError } from '../utils/errors.js';

/**
 * FortMed SMS Service
 */

/**
 * PhilSMS Service Integration
 */

const PHILSMS_API_URL = process.env.PHILSMS_API_URL || 'https://dashboard.philsms.com/api/v3';
const PHILSMS_API_TOKEN = process.env.PHILSMS_API_TOKEN;
const PHILSMS_SENDER_ID = process.env.PHILSMS_SENDER_ID || 'PhilSMS';

console.log('[SMS Service] PhilSMS Initialization:', {
    endpoint: PHILSMS_API_URL,
    senderId: PHILSMS_SENDER_ID,
    tokenPresent: !!PHILSMS_API_TOKEN
});

/**
 * Send an SMS via PhilSMS.
 * 
 * @param {string} to - Recipient phone number (e.g., +639XXXXXXXXX or 09XXXXXXXXX)
 * @param {string} message - Message content
 * @returns {Promise<object>} - PhilSMS API response
 */
export const sendSMS = async (to, message) => {
    if (!PHILSMS_API_TOKEN) {
        console.warn('[SMS] Skipping SMS send: PHILSMS_API_TOKEN not configured.');
        return { success: false, reason: 'unconfigured' };
    }

    if (!to) {
        throw new AppError('Recipient phone number is required.', 400);
    }

    // Best Practice: Character length warning
    if (message.length > 150) {
        console.warn(`[SMS Warning] Message (${message.length} chars) exceeds 150 characters. May increase costs.`);
    }

    // Standardize phone format to 63XXXXXXXXXX (PhilSMS preference)
    let cleanTo = to.trim().replace(/\D/g, ''); // Remove non-digits
    
    if (cleanTo.startsWith('09')) {
        cleanTo = '63' + cleanTo.substring(1);
    } else if (cleanTo.startsWith('9')) {
        cleanTo = '63' + cleanTo;
    } else if (cleanTo.startsWith('+')) {
        // replace(/\D/g, '') already removed the +
    }
    // If it already starts with 63, it stays as 63

    try {
        /*
        // =========================================================
        // OLD PROVIDER LOGIC (FortMed - COMMENTED OUT)
        // =========================================================
        const FORTMED_API_KEY = '...';
        const FORTMED_API_URL = '...';
        const payload = { SenderName: '...', ToNumber: cleanTo, MessageBody: message };
        const response = await fetch(FORTMED_API_URL, { ... });
        */

        // =========================================================
        // NEW PROVIDER LOGIC (PhilSMS)
        // =========================================================
        console.log(`📱 [SMS] Sending to ${cleanTo}: "${message.substring(0, 50)}..."`);

        const response = await fetch(`${PHILSMS_API_URL}/sms/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PHILSMS_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                recipient: cleanTo,
                sender_id: PHILSMS_SENDER_ID,
                message: message,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`📱 [SMS] SUCCESS: Message sent to ${cleanTo} via PhilSMS`);
            return { success: true, ...data };
        } else {
            console.error(`📱 [SMS] API ERROR (PhilSMS): ${response.status} - ${JSON.stringify(data)}`);
            return { success: false, status: response.status, ...data };
        }
    } catch (err) {
        console.error(`📱 [SMS] ERROR: ${err.message}`);
        return { success: false, error: err.message };
    }
};

