import { format } from 'date-fns';

/**
 * Helper to format date/time range in a premium way.
 */
const formatDateTimeRange = (date, startTime, endTime) => {
    if (!date || !startTime) return '';
    try {
        const d = new Date(date);
        const dateStr = format(d, 'MMMM d, yyyy');
        
        // Assume startTime/endTime are "HH:mm:ss" or "HH:mm"
        const formatTime = (t) => {
            if (!t) return '';
            const [h, m] = t.split(':');
            const hour = parseInt(h, 10);
            const ampm = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m}${ampm}`;
        };

        const start = formatTime(startTime);
        const end = endTime ? ` - ${formatTime(endTime)}` : '';
        
        return `${dateStr} at ${start}${end}`;
    } catch (e) {
        return `${date} ${startTime}`;
    }
};

/**
 * Reconstructs a notification's content based on its type and metadata.
 * Returns { title, message (JSX), text (string) }
 */
export const renderNotification = (notification) => {
    let data = null;
    try {
        if (typeof notification.message === 'string' && notification.message.startsWith('{')) {
            data = JSON.parse(notification.message);
        }
    } catch (e) {
        // Not JSON, use as-is
    }

    if (!data || !data._isJSON) {
        return {
            title: notification.title,
            message: notification.message,
            text: notification.message
        };
    }

    const { type } = notification;
    const { service, date, start_time, end_time, reason, action } = data;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);

    let title = data._title || notification.title;
    let message = data._fallback || notification.message;
    let text = data._fallback || notification.message;

    // Helper to bold important parts - Using <b> and explicit 900 weight for maximum visibility
    const b = (val) => <b className="font-black text-gray-900 dark:text-white" style={{ fontWeight: 900 }}>{val}</b>;

    switch (type) {
        case 'CONFIRMATION':
            if (action === 'approved') {
                title = 'Appointment Approved!';
                message = <>Good news! Your {b(service)} appointment on {b(formattedRange)} has been approved.</>;
                text = `Good news! Your ${service} appointment on ${formattedRange} has been approved.`;
            } else {
                title = 'Appointment Confirmed';
                message = <>Your {b(service)} appointment is confirmed for {b(formattedRange)}.</>;
                text = `Your ${service} appointment is confirmed for ${formattedRange}.`;
            }
            break;
            
        case 'CANCELLATION':
            if (action === 'rejected') {
                title = 'Appointment Request Declined';
                message = <>Your request for {b(service)} on {b(formattedRange)} was declined. {reason ? <>{'Reason: '}{b(reason)}</> : ''}</>;
                text = `Your request for ${service} on ${formattedRange} was declined. ${reason ? 'Reason: ' + reason : ''}`;
            } else {
                title = 'Appointment Cancelled';
                message = <>Your {b(service)} appointment on {b(formattedRange)} has been cancelled.</>;
                text = `Your ${service} appointment on ${formattedRange} has been cancelled.`;
            }
            break;

        case 'GENERAL':
            if (data.status === 'review') {
                title = 'Request Received & Under Review';
                message = <>Your request for {b(service)} on {b(formattedRange)} has been received. Our team is currently reviewing your schedule to ensure a dentist is available.</>;
                text = `Your request for ${service} on ${formattedRange} has been received. Our team is currently reviewing your schedule.`;
            }
            break;

        case 'REMINDER':
        case 'REMINDER_48H':
            message = <>Don't forget! Your {b(service)} appointment is on {b(formattedRange)}.</>;
            text = `Don't forget! Your ${service} appointment is on ${formattedRange}.`;
            break;

        case 'DELAY':
            message = <>Dr. {b(data.dentist_name)} is running approximately {b(data.estimated_delay_minutes)} minutes behind schedule.</>;
            text = `Dr. ${data.dentist_name} is running approximately ${data.estimated_delay_minutes} minutes behind schedule.`;
            break;

        case 'NO_SHOW':
            message = <>You missed your appointment on {b(date)} at {b(start_time)}{service ? <> for {b(service)}</> : ''}.</>;
            text = `You missed your appointment on ${date} at ${start_time}${service ? ' for ' + service : ''}.`;
            break;

        case 'WAITLIST':
            message = <>A slot opened up on {b(date)} at {b(start_time)}{service ? <> for {b(service)}</> : ''}.</>;
            text = `A slot opened up on ${date} at ${start_time}${service ? ' for ' + service : ''}.`;
            break;

        case 'RESTRICTION':
            message = <>Due to {b(data.noShowCount)} missed appointments, your booking has been restricted.</>;
            text = `Due to ${data.noShowCount} missed appointments, your booking has been restricted.`;
            break;
    }

    return { title, message, text };
};
