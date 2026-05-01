/**
 * SMS Templates for Primera Dental
 * All templates should aim to be under 150 characters to stay within 1 SMS part.
 */
export const SMS_TEMPLATES = {
    OTP: (code) =>
        `Primera Dental: Your verification code is ${code}. Valid for 10 mins. Do not share this code.`,
    
    BOOKING_CONFIRMED: (date, time) =>
        `Primera Dental: Your appointment is confirmed for ${date} at ${time}. Please arrive 10 mins early.`,
    
    // Reminders
    REMINDER_24H: (date, time, service) =>
        `Primera Dental Reminder: Your ${service} is tomorrow, ${date} at ${time}. See you soon!`,

    REMINDER_48H: (date, time, service) =>
        `Primera Dental: Your ${service} is in 2 days on ${date} at ${time}. Reply YES to confirm.`,
};

/**
 * Validates message length and warns if it exceeds standard SMS parts
 */
export const validateSmsLength = (message) => {
    if (message.length > 150) {
        console.warn(
            `[SMS Warning] Message (${message.length} chars) exceeds 150 characters and may cost more.`
        );
    }
    return message;
};
