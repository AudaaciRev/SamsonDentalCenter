# Secretary/Receptionist Portal — Refined Frontend UX Blueprint

## Global Layout & The Universal Drawer

### Layout Structure

- **Left Sidebar:** Front Desk (Today), Calendar, Approvals (Badge), Booking Desk, Waitlist,
  Patients.
- **Top Header:** Global Search (Name/Phone), Date Picker, Notification Bell, + New Booking button.

### Universal Right-Side Drawer

Opens clicking any appointment or patient anywhere in the app.

- **Contents:** Patient Header, Status Badges, Appointment Metadata, Past 3 visits, latest treatment
  notes.
- **Quick Actions:** Check-In, Complete, Cancel, Mark No-Show, Add Internal Comment.

**Crucial UX Rule:** Do not put "Reschedule" in this drawer. Rescheduling requires visual context of
conflicts and belongs on the Master Calendar.

---

## Page 1: Front Desk (Today's Operations)

This page is entirely driven by the computer's current time compared against the `start_time` and
`end_time` of today's appointments.

### Layout: 3-Column Board

1. **Incoming:** PENDING and CONFIRMED appointments.
2. **In Clinic:** IN_PROGRESS (checked-in).
3. **Completed:** COMPLETED.

### The "Incoming" Card Lifecycle (Strict Time Rules)

The frontend must automatically transition these cards based on the clock:

**State 1: Normal (Before start_time)**

- **Visual:** Standard card design.
- **Primary Button:** Check In (Moves to "In Clinic").

**State 2: Late / Shortened (Between start_time and end_time)**

- **Visual:** Card border turns Amber. A live timer badge appears (e.g., -12m late).
- **Primary Button:** Check In (Shortened).
- **Frontend Action:** Clicking this updates status to IN_PROGRESS and prompts the secretary to
  confirm: "Patient is late. Treatment ends strictly at [end_time]." It automatically appends an
  internal `appointment_comments` noting the late arrival and strict cutoff.
- **Manual Toggle:** The secondary menu (⋯) holds a Mark No-Show button if the patient calls to
  cancel during this window.

**State 3: Time's Up (At exactly end_time)**

- **Visual:** If the card was never checked in, it flashes Red and is pulled out of the Incoming
  column into an "Action Required" sticky banner at the top of the board.
- **Primary Button:** Process No-Show.
- **Frontend Action:** Forces the secretary to confirm the No-Show, which writes to the database and
  triggers the patient's penalty counters.

---

## Page 2: Master Calendar

The visual command center for scheduling and conflict resolution.

- **View:** Weekly or Daily grid with toggles to filter by Dentist.
- **Ghost Blocks:** Pending specialized requests render as striped, semi-transparent blocks to
  visualize space before approval.
- **Drag & Drop Reschedule:** Moving a block pops up a confirmation toast. The frontend must
  validate against `dentist_schedule`, `clinic_holidays`, and `dentist_availability_blocks` before
  allowing the drop.
- **Time Blocking:** A toolbar button to "Block Time" (Leave/Emergency) that drops a solid grey/red
  block on a dentist's schedule, preventing future bookings.

---

## Page 3: Approvals Center (Two-Tier Management)

A split-pane view for rapidly clearing the specialized request queue.

- **Left Pane:** Scrollable list of pending specialized requests.
- **Right Pane (Context):**
    - Patient's penalty history (`no_show_count`, `cancellation_count`).
    - A mini-timeline of the requested Dentist's day to verify workload capacity.

### Actions:

- **Approve:** Giant green button. Updates status to CONFIRMED.
- **Reject:** Red button that transforms into a dropdown requiring a `rejection_reason` before
  finalizing the cancellation.

---

## Page 4: Booking Desk (Walk-In & Manual Booking)

Built for speed (under 30 seconds to book).

- **Patient Search:** Autocomplete lookup or a "Guest/Walk-In" toggle.
- **Slot Override:** If a time slot is locked by an online user (`slot_holds`), it shows a lock
  icon. The secretary can click it to force-override the hold for the in-person patient.

**The Auto-Approve Rule:** If the secretary selects a specialized service, the UI must flash a badge
reading "Auto-Approved by Staff". Submitting this form bypasses the PENDING state entirely and
inserts straight as CONFIRMED with the secretary logged as the approver.

---

## Page 5: Waitlist Manager (The 3-Hour Cutoff)

This page is driven by early cancellations. Same-day, last-minute no-shows do not trigger this flow.

### Frontend Cancellation Intercept

Whenever the secretary clicks Cancel on any appointment, the frontend calculates the difference
between `current_time` and `appointment_date` + `start_time`.

- **If Gap < 3 Hours:**
    - The cancellation proceeds silently.
    - Toast: "Appointment cancelled. Too close to start time to notify waitlist."

- **If Gap >= 3 Hours:**
    - The cancellation proceeds.
    - Modal Pops Up: "Appointment cancelled. There are [X] patients on the waitlist for this
      time/service. [Review Waitlist]"

### The Queue View

Displays patients waiting for a specific date/service.

- **Action:** Notify. Triggers an email/SMS with a 25-minute claim token, changing the row status to
  NOTIFIED and starting a visual countdown timer on the UI.

---

## Shared UX Patterns

- **The 5-Second Undo Hold:** Because the database makes true "Undos" highly complex (due to
  cascading triggers and waitlists), handle mistakes on the frontend. When the secretary clicks
  Cancel or Process No-Show, display a toast with an active loading bar for 5 seconds containing an
  Undo button. Only fire the API request to the backend when the 5 seconds expire.

- **Color Vocabulary:**
    - 🟢 **Green:** Confirmed/Completed
    - 🟠 **Amber:** Late / Needs Attention
    - 🔴 **Red:** No-Show / Action Required / Blocked Time
    - 🦓 **Striped:** Pending Specialized Request
