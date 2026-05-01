# Waitlist Feature: Stash & Disable Plan

## 1. Evaluation: Should you keep the Waitlist right now?

**My Honest Engineering Verdict: Stashing it is a very smart move for now.** As we discovered in the
UX QA (`USER_BOOKING_USE_CASES.md`), the current waitlist has a major flaw: when a slot opens and
emails a waitlisted user, a random public user can still steal that slot before the waitlisted user
clicks the link.

Fixing this requires building a "Guaranteed Soft-Hold Queue"—which means creating temporary database
locks, expiration cron jobs, and complex routing. That is a massive undertaking for an MVP (Minimum
Viable Product).

By stashing the waitlist now, you ensure **100% stable, bug-free standard bookings**. You can easily
un-stash and rebuild a better waitlist in V2 once the clinic is making money.

---

## 2. Stashing Strategy (The "Soft Disable")

**The Rule:** We will NOT delete any files or drop any tables. We will use **Feature Flags** or
**Block Comments** (`/* ... */`) to hide the feature from users, effectively cutting off the flow of
traffic to the waitlist logic.

---

## 3. Frontend Instances to Disable (`apps/`)

### A. User App (`apps/user`)

1. **The Booking Calendar (Time Slot Selection):**
    - _Target:_ Find the component rendering the time slots (e.g., `TimeSelection.jsx` or
      `SlotGrid.jsx`).
    - _Action:_ Comment out the `<button>` or UI state that says "Join Waitlist" when a slot is
      full.
    - _Fallback:_ Just let full slots look greyed out / unclickable like a normal booking site.
2. **Guest Booking Flow (Often Forgotten):**
    - _Target:_ `GuestBooking.jsx` or the unauthenticated booking wizard.
    - _Action:_ If non-logged-in users are allowed to join the waitlist by entering their email,
      hide this prompt on the guest flow too.
3. **The Submit Booking Hook (Double Selection):**
    - _Target:_ The `useUserBooking` hook or submit handler.
    - _Action:_ If the code does a `Promise.allSettled` to book an appointment _and_ join a waitlist
      simultaneously, comment out the waitlist API call part.
4. **User Dashboard / Profile:**
    - _Target:_ The user's portal where they manage appointments.
    - _Action:_ If there is a "My Waitlists" tab or list, comment out the React component
      (`{/* <WaitlistPanel /> */}`).
5. **React Router Paths (Crucial for all apps):**
    - _Target:_ `App.jsx` or `routes.jsx`.
    - _Action:_ If a user manually types `/waitlist` or `/profile/waitlist` in the URL bar, it might
      crash or show broken UI. Comment out the route or redirect it to `/dashboard`.
6. **Notification Bell Dropdown:**
    - _Target:_ The component rendering the user's notifications.
    - _Action:_ Filter out notifications where `type === 'WAITLIST'`. If you don't, users might
      still see old waitlist alerts, click them, and get an error.
7. **Post-Booking Success Screen ("Move Up" Prompt):**
    - _Target:_ `BookingSuccess.jsx` or the confirmation modal after a successful booking.
    - _Action:_ In many medical apps, after booking a late date, the system asks: _"You are booked
      for Nov 14. Want an earlier date? Join the Waitlist."_ If this post-booking prompt exists,
      comment it out.

### B. Secretary/Admin Apps (`apps/secretary`, `apps/admin`)

1. **Waitlist Management Dashboard:**
    - _Target:_ Any sidebar navigation link pointing to `/waitlist`.
    - _Action:_ Comment out the `NavLink` in the Sidebar component. The page code can stay in the
      repository, just remove the button that takes the secretary there.
2. **Audit Log UI Rendering (Crash Risk):**
    - _Target:_ `AuditLogs.jsx` (where admins see system history).
    - _Action:_ The `audit_log` table might contain old entries where
      `resource_type === 'waitlist'`. Ensure the UI component that maps over these logs does not
      crash if it tries to render a specific "Waitlist Details" button or badge for those old
      entries.
3. **Dashboard KPI / Stat Cards (CRITICAL CRASH RISK):**
    - _Target:_ The main dashboard home pages (`Dashboard.jsx`).
    - _Action:_ If there is a widget showing "Waitlist Count: 12", you _must_ comment out the
      component and the data-fetching hook (e.g., `useWaitlistStats()`). If you leave the fetch in
      and the backend returns a 503, it will throw a giant red error toast or crash the dashboard.
4. **Patient Detail / CRM View:**
    - _Target:_ The UI where admins/secretaries view a specific patient's profile and history.
    - _Action:_ Does the profile show a "Waitlisted Appointments" table alongside "Past" and
      "Upcoming"? Comment out that specific table and its backend fetch.
5. **Secretary "New Appointment" Warning / Conflict Check (Crucial UX):**
    - _Target:_ The Secretary/Admin Manual Booking Flow (`CreateAppointment.jsx` or backend
      `checkAvailability`).
    - _Action:_ When a secretary manually books a time slot for someone, does the system query the
      waitlist and show a warning like: _"Note: 3 people are on the waitlist for this slot"_?
      Comment out this warning fetch so secretaries aren't distracted by "ghost" waitlist data.
6. **Appointment "Source" Badge Rendering (Historical Data Crash Risk):**
    - _Target:_ Any component mapping `appointments` (Admin Schedule, Doctor Daily View, User
      Dashboard).
    - _Action:_ Your schema has an `appointments.source` column which can be `'WAITLIST'`. Check
      your frontend UI where it displays badges (e.g., `<Badge>{appointment.source}</Badge>`). If
      you have a `switch(source)` statement to render icons, ensure it doesn't crash or show a
      broken/missing icon for _past_ appointments that were booked via the waitlist.
7. **Clinic Settings / Feature Toggles:**
    - _Target:_ Admin `Settings.jsx` or `ClinicSettings` view.
    - _Action:_ Make sure to hide any configuration inputs related to the waitlist (e.g., "Max
      Waitlist Duration", "Waitlist Priority Toggles") so the Admin isn't confused.
8. **Analytics & Reports Page:**
    - _Target:_ `Reports.jsx` or `Analytics.jsx` in the Admin app.
    - _Action:_ If there are charts for "Waitlist Conversion Rate", "Waitlist Volume", or a "CSV
      Export Waitlist" button, comment them out. A 503 from the backend here will crash the charting
      library.
9. **Calendar Badges:**
    - _Target:_ The main calendar view.
    - _Action:_ Check if the calendar fetches waitlist counts to show a "3 waiting" badge on days.
      Comment out that fetch request to save database load.
10. **Patient Detail / CRM View:**
    - _Target:_ The UI where admins/secretaries view a specific patient's profile and history.
    - _Action:_ Does the profile show a "Waitlisted Appointments" table alongside "Past" and
      "Upcoming"? Comment out that specific table and its backend fetch.
11. **Appointment Modals / Manual Overrides:**
    - _Target:_ The Appointment details modal or "Create Appointment" form for Secretaries.
    - _Action:_ If there is a manual "Add Patient to Waitlist" or "Move to Waitlist" button, hide
      it. Also hide any "Convert Waitlist to Appointment" buttons.
12. **Global Search Bar (Hidden Crash Risk):**
    - _Target:_ The overarching search bar in the Admin/Secretary top navigation.
    - _Action:_ If the global search queries the `waitlist` table to find patients and returns a
      clickable result that routes to `/waitlist/details/:id`, you _must_ remove the `waitlist`
      table from the search API query. Clicking a dead link will crash the app.

### C. Doctor App (`apps/doctor`)

1. **Doctor Dashboard / Schedule View:**
    - _Target:_ The doctor's daily view.
    - _Action:_ If the doctor UI indicates how many people are on the waitlist for their shifts,
      comment out those UI summary cards and their associated data-fetching hooks.

---

## 4. Backend Instances to Disconnect (`apps/api`)

Because we hid the UI buttons, the backend endpoints won't receive traffic. However, we MUST sever
the internal triggered logic so the backend doesn't try to process phantom waitlists.

1. **Appointment Cancellation Logic (Crucial):**
    - _Target:_ The `POST /api/appointments/:id/cancel` endpoint (or the `cancelAppointment`
      service).
    - _Action:_ Find the exact line that calls `notifyWaitlist()` or checks the waitlist table when
      an appointment frees up a slot. Wrap it in a block comment.
    - _Why:_ If you don't comment this out, the backend might crash trying to notify an empty list,
      or unexpectedly email someone from old test data.
2. **Appointment Rescheduling Logic (Highly Missed!):**
    - _Target:_ `POST /api/appointments/:id/reschedule`
    - _Action:_ When a patient _reschedules_, they free up their old time slot. Check if your
      rescheduling logic calls `notifyWaitlist()` for the abandoned slot. If it does, comment it out
      immediately.
3. **Specialized Service Rejection Logic (Two-Tier System Risk):**
    - _Target:_ `POST /api/appointments/:id/reject` (Admin rejection of pending specialized
      appointments).
    - _Action:_ When an admin formally rejects an appointment, it frees that slot on the calendar.
      Ensure `notifyWaitlist()` is commented out inside the rejection service, otherwise rejecting a
      patient will instantly email the waitlist for that slot.
4. **Doctor Availability Blocks & Clinic Holidays (Mass Trigger Risk):**
    - _Target:_ `POST /api/dentist-blocks` and `POST /api/clinic-holidays`
    - _Action:_ If an admin adds a "Leave" block or a "Holiday", the backend typically mass-cancels
      existing appointments. Ensure that inside that mass-cancellation loop, it does NOT trigger
      waitlist notifications for the suddenly "freed" slots (since the clinic is closed anyway,
      sending waitlist offers would be a critical bug).
5. **Service Deactivation or Modification:**
    - _Target:_ `PUT /api/services/:id`
    - _Action:_ If an admin "Deactivates" a dental service, the backend might automatically check
      the waitlist for that service to send a "Service No Longer Available" cancellation email. Find
      and comment out this cascading notification.
6. **Automated Cancellations (Cron / 48h unconfirmed):**
    - _Target:_ Any cron job that automatically cancels appointments because the patient didn't
      confirm 48 hours prior.
    - _Action:_ Make sure the auto-cancellation script does _not_ have a hidden `notifyWaitlist()`
      call buried in its loop.
7. **Email/SMS Background Worker Queues:**
    - _Target:_ `services/email.service.js` or your background queue processor (e.g., BullMQ, Redis,
      or simple interval worker).
    - _Action:_ Add a safety catch at the top: `if (payload.type === 'waitlist') return;`. This
      immediately stops any lingering old waitlist notification events that might be stuck in a
      retry loop from sending out tomorrow.
8. **Waitlist Route Handlers (Defensive API Design):**
    - _Target:_ `routes/waitlist.routes.js`
    - _Action:_ You can leave the routes. **HOWEVER, do NOT return a `503 Error` for `GET`
      requests.** If you missed a hidden dashboard widget on the frontend, and it receives a 503
      instead of an array, you will get a `"waitlist.map is not a function"` error and the entire
      React tree will White-Screen crash.
    - _Safe Approach:_
        - For `POST/PUT/DELETE /waitlist`: Return `400 Bad Request` or `503` with "Feature
          disabled".
        - For `GET /waitlist` or `GET /waitlist/stats`: **Return an empty array and zero count:**
          `return res.status(200).json({ data: [], count: 0 });` This gracefully starves any
          lingering UI components without crashing them.
9. **Daily Agenda / Morning Briefing Emails:**
    - _Target:_ `cron.js` or daily email schedule worker.
    - _Action:_ If the system sends a "Good Morning! Here is today's schedule" summary email to the
      Doctors or Secretaries, check if it injects a "Waitlist queue for today" count. Comment that
      out so it doesn't calculate/print zero or error out on the email payload.
10. **Waitlist "Claim" Links from Old Emails (Edge Case):**
    - _Target:_ `GET /api/waitlist/claim/:token` (or similar).
    - _Action:_ If a user is currently on the waitlist right now and receives an email today, and
      you disable the feature tomorrow, they might click the old link. Make sure this endpoint
      gracefully returns a message like: _"This waitlist slot has expired or the feature is
      temporarily paused."_
11. **User Data Export Scripts (GDPR/Data Privacy):**
    - _Target:_ Any backend service that handles "Download all my data" requests.
    - _Action:_ If your system aggregates `user`, `appointments`, and `waitlists` to generate a
      JSON/PDF export for the user, ensure it doesn't crash if the waitlist query returns
      empty/disabled.
12. **Turn Off Frontend React Query/SWR Background Polling:**
    - _Target:_ Hooks like `useGetWaitlist()` or `api.client.js`.
    - _Action:_ React Query automatically refetches data in the background when users switch tabs.
      Change `enabled: false` on the waitlist query hooks to completely stop the browser from even
      attempting the API calls.

## 5. DevOps & Testing

1. **E2E Tests (Cypress / Playwright):**
    - _Target:_ Frontend end-to-end testing suites.
    - _Action:_ If your CI/CD pipeline runs tests that explicitly click the "Join Waitlist" button,
      they will fail and block deployment. You must `test.skip()` or comment out the
      waitlist-specific E2E tests.

---

## Summary Checklist for this Plan

- [ ] Hide "Join Waitlist" UI on User Booking page.
- [ ] **Check Post-Booking Success modal for "Join waitlist for an earlier date" prompts.**
- [ ] Hide Waitlist UI on Guest Booking page.
- [ ] Hide "My Waitlists" from User Dashboard.
- [ ] Protect `/waitlist` React Router paths across all apps (Redirect to dashboard).
- [ ] Filter out `WAITLIST` type notifications in the User Notification Bell.
- [ ] Hide Waitlist Navigation Link from Admin/Secretary sidebars.
- [ ] Remove `waitlist` from Global Search Bar results in Admin/Secretary.
- [ ] **Comment out "Waitlist Conflict Warnings" when Secretaries manually book slots.**
- [ ] **Check UI for crash risks when rendering historical appointments where
      `source === 'WAITLIST'`.**
- [ ] Ensure Audit Log UI handles old `resource_type='waitlist'` entries without crashing.
- [ ] Remove Waitlist KPI Stat Cards from Admin/Secretary Dashboard (Prevents crashes).
- [ ] Remove Waitlist Charts/Exports from Admin Analytics Page.
- [ ] Hide "Waitlisted Appointments" table from the Admin/Secretary Patient CRM view.
- [ ] Hide "Add to Waitlist" buttons inside Admin/Secretary appointment modals.
- [ ] **Hide Waitlist configurations from Admin Settings page.**
- [ ] Hide Waitlist stats/badges from Doctor App.
- [ ] Comment out the `notifyWaitlist` function inside the Appointment Cancellation backend service.
- [ ] Comment out the `notifyWaitlist` function inside the Appointment RESCHEDULE backend service.
- [ ] Comment out the `notifyWaitlist` function inside the Specialized Service REJECTION backend
      service.
- [ ] Ensure Doctor Leave Blocks & Clinic Holidays do not trigger waitlist notifications when
      mass-canceling.
- [ ] Comment out waitlist notifications triggered by Admin Service Deactivation.
- [ ] Ensure Auto-Cancellation (48hr check) Cron Jobs do not trigger waitlist notifications.
- [ ] Add safety block in Email/SMS queues to silently drop `waitlist` message types.
- [ ] **Remove waitlist counts from the "Daily Agenda / Morning" summary emails for staff.**
- [ ] Return "Empty Arrays/Zeroes" for `GET /waitlist` API endpoints instead of 503s to prevent
      frontend `.map()` crashes.
- [ ] Add `503 Unavailable` early returns to `POST/DELETE` Waitlist API endpoints.
- [ ] Handle edge-case clicks on old `waitlist/claim` email links.
- [ ] **Ensure GDPR "User Data Export" backend scripts don't crash when waitlist logic is
      disabled.**
- [ ] Turn off Waitlist Cron Jobs.
- [ ] Disable internal background polling (`enabled: false` in React Query for waitlist endpoints).
- [ ] Comment out any Supabase Realtime listeners attached to the `waitlist` table.
- [ ] Verify there are no hidden Postgres `AFTER DELETE` Webhook Triggers on the appointments table.
- [ ] **Skip/Disable E2E (Cypress/Playwright) tests that look for the Waitlist UI to prevent CI/CD
      pipeline failures.**
- [ ] Update `USER_BOOKING_USE_CASES.md` to mark the Waitlist use cases as disabled.
- [ ] Leave DB tables and Email templates exactly as they are.
