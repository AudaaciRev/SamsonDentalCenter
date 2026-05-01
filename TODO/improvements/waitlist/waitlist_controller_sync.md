# Improvement: Synchronize Waitlist Controller with Service

## Problem
The standalone waitlist join API in `apps/api/src/controllers/waitlist.controller.js` is currently out of sync with the `waitlist.service.js`. While the service supports specific doctor preferences and family booking ("booked for"), the controller does not pass these parameters.

## Identified Gap
In `waitlist.controller.js`, the `join` function only extracts:
- `service_id`
- `date`
- `time`
- `priority`

It **missess**:
1. `preferred_dentist_id`: Users cannot specify a preferred doctor when using the standalone API.
2. `booked_for_name_parts`: Users cannot specify if they are booking the waitlist for a family member.

## Impact
If a user joins the waitlist via a standalone "Join Waitlist" button (instead of the Booking Wizard), their doctor preference is lost, and the system defaults to "Any Doctor" matching.

## Solution
Update `join` in `apps/api/src/controllers/waitlist.controller.js` to extract and pass the missing fields:

```javascript
// apps/api/src/controllers/waitlist.controller.js

export const join = async (req, res, next) => {
    try {
        const { 
            service_id, 
            date, 
            time, 
            priority, 
            preferred_date, 
            preferred_time,
            preferred_dentist_id, // Add this
            booked_for_name_parts  // Add this
        } = req.body;

        const finalDate = date || preferred_date;
        const finalTime = time || preferred_time;

        if (!service_id || !finalDate) {
            return res.status(400).json({ error: 'service_id and date are required.' });
        }

        const result = await joinWaitlist(
            req.user.id, 
            service_id, 
            finalDate, 
            finalTime, 
            priority,
            booked_for_name_parts, // Pass this
            preferred_dentist_id    // Pass this
        );
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};
```
