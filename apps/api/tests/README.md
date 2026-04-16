# 🧪 Reminder System Testing

This directory contains tools for manually triggering and verifying the appointment reminder system.

## Trigger Test Reminders

The `trigger_reminders.js` script finds the latest **Patient** and **Guest** appointments and forces both 24h and 48h reminder emails to be sent to them.

### How to Run

1. Open your terminal at the root of the project.
2. Navigate to the API directory:
   ```bash
   cd apps/api
   ```
3. Run the test script:
   ```bash
   node tests/trigger_reminders.js
   ```

### What to Expect

- **Patient Reminders**: Two emails (24h and 48h variants) sent to the patient's registered email address. These include a plain heads-up message.
- **Guest Reminders**: Two emails (24h and 48h variants) sent to the guest's email address. These include unique action links for **[Reschedule]** and **[Cancel]**.

## Automated Scheduler

The production scheduler is located in `src/utils/scheduled-tasks.js`. 

**Do you need to modify it?**
No. It is already fully configured to:
- Run every day at **8:00 AM**.
- Automatically check for appointments tomorrow (24h) and the day after tomorrow (48h).
- **12-Hour Safety Rule**: It automatically skips any appointment that was booked/confirmed less than 12 hours before the reminder window to avoid spamming the user.

Everything is automated—as long as the API server is running (`pnpm dev` or `npm start`), the reminders will be sent.
