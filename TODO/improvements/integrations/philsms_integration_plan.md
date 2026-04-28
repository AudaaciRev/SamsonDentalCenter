# PhilSMS Provider Integration Plan

## Objective

Replace the current SMS provider with a new provider (**PhilSMS**) for sending notifications (e.g.,
OTPs, appointment reminders, system alerts). The old SMS provider will be temporarily commented out
rather than deleted, allowing for an easy rollback if needed.

## 1. Environment Variable Configuration (`apps/api/.env`)

We need to keep sensitive tokens out of the codebase. Add the new PhilSMS credentials to your
backend `.env` file.

```env
# --- NEW SMS PROVIDER (PhilSMS) ---
PHILSMS_API_URL=https://dashboard.philsms.com/api/v3
PHILSMS_API_TOKEN=2486|t4wBbpkbGAjey1alCG0QrAzVq46ctqfpONXetD2Jd00af64f

# --- OLD SMS PROVIDER (Commented out / Deprecated) ---
# OLD_SMS_PROVIDER_KEY=...
```

## 2. Backend Implementation / Service Update (`apps/api/`)

Locate your current SMS service utility (e.g., `services/sms.service.js` or `utils/sms.js`). We will
comment out the existing logic and introduce the PhilSMS `fetch` call.

### Proposed Code Structure

```javascript
// apps/api/src/services/sms.service.js (or similar)

/**
 * Sends a text message using PhilSMS API v3
 *
 * @param {string} phoneNumber - The recipient's phone number (ensure proper PH format: 09... or +639...)
 * @param {string} message - The text message to send
 */
export const sendSMS = async (phoneNumber, message) => {
    try {
        // =========================================================
        // OLD PROVIDER LOGIC (COMMENTED OUT)
        // =========================================================
        /*
    const oldClient = new OldSmsProvider(process.env.OLD_SMS_API_KEY);
    await oldClient.messages.create({
      to: phoneNumber,
      from: 'PrimeraDental',
      text: message
    });
    return true;
    */

        // =========================================================
        // NEW PROVIDER LOGIC (PhilSMS)
        // =========================================================
        const API_URL = process.env.PHILSMS_API_URL || 'https://dashboard.philsms.com/api/v3';
        const API_TOKEN = process.env.PHILSMS_API_TOKEN;

        // Best Practice: Log a warning if message exceeds standard 1-part SMS length (~160 chars, we use 150 for safety)
        if (message.length > 150) {
            console.warn(
                `[SMS Warning] Message length (${message.length} chars) exceeds 150 characters. This may count as multiple SMS parts and increase costs.`,
            );
        }

        // Note: Assuming the standard sending endpoint for PhilSMS is /sms/send
        // You may need to verify the exact endpoint path in their documentation
        const response = await fetch(`${API_URL}/sms/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                recipient: phoneNumber,
                sender_id: 'PhilSMS', // Replace with your approved Sender ID if you have one
                message: message,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('PhilSMS Error payload:', data);
            throw new Error(`PhilSMS API Error: ${response.statusText}`);
        }

        // Success log
        console.log(`[SMS Sent] Successfully sent to ${phoneNumber} via PhilSMS`);
        return data;
    } catch (error) {
        console.error(`[SMS Error] Failed to send to ${phoneNumber}:`, error.message);
        throw error; // Or handle silently depending on your notification architecture
    }
};
```

## 3. SMS Templates & Character Limits

To strictly manage costs and ensure high delivery rates, avoid dynamically generating massive
strings on the fly. Define your SMS templates as constants so you can visually audit their length
before deployment.

```javascript
// apps/api/src/constants/smsTemplates.js

export const SMS_TEMPLATES = {
    OTP: (code) =>
        `Primera Dental: Your verification code is ${code}. Valid for 10 mins. Do not share this code.`, // ~85 chars
    BOOKING_CONFIRMED: (date, time) =>
        `Primera Dental: Your appointment is confirmed for ${date} at ${time}. Please arrive 10 mins early.`, // ~95 chars
    REMINDER_48H: (date, time) =>
        `Primera Dental Reminder: You have an appt on ${date} at ${time}. Reply YES to confirm or call us to reschedule.`, // ~110 chars
};

// You can use a simple unit test or script to ensure no template exceeds 150 chars even with max-length variables.
```

## 4. Formatting Considerations & Best Practices

- **Character Limits (The 150/160 Rule):** A standard SMS is 160 characters. Exceeding this breaks
  the message into multiple parts, doubling your API cost. Keep templates concise and below 150
  characters to account for variable injection (like long dates or names).
- **Phone Number Format:** PhilSMS usually requires strict formatting (e.g., strictly `+639...` or
  `09...`). Before sending the request, ensure you have a helper utility to sanitize user inputs to
  the correct format required by the API.
- **Sender ID:** Ensure you check PhilSMS docs to see if they require a specific `sender_id` string,
  or if you can request a custom one (e.g., `Primera`).
- **Asynchronous Processing:** Don't block the main HTTP request waiting for PhilSMS to respond.
  Ideally, trigger `sendSMS` asynchronously or push it to a background job queue so the user's
  booking completes instantly even if the SMS API is slow.
- **Fallback / Silent Failures:** If the SMS fails, do not roll back the creating of the appointment
  unless it's an OTP required to proceed. For reminders, fail silently on the frontend but log
  heavily on the backend.

## 5. Execution Steps

1. Add `PHILSMS_API_TOKEN` and `PHILSMS_API_URL` to your local and production `.env` files.
2. Define your constant templates in an `smsTemplates.js` file and verify their lengths.
3. Locate the existing SMS sending function in `apps/api`.
4. Wrap the old provider code in a block comment `/* ... */`.
5. Paste the new PhilSMS fetch logic, including the length warning logic.
6. Trigger a test notification (e.g., resend an OTP or create a test booking) to verify the text
   successfully arrives on your phone.
