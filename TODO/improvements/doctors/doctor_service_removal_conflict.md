# Service Removal & Active Appointments Edge Case Plan

## Objective

Define the system behavior when a service is removed from a doctor's repertoire, but that doctor
still has _active (future)_ appointments booked for that specific service.

## The Problem

If a doctor decides they no longer offer "Teeth Whitening" and an Admin removes that service from
their profile, what happens to the patient booked next week for that service with that doctor?

## Proposed Solutions (To be decided before implementation)

### Option A: Block Removal & Require Manual Reassignment (Safe & Strict)

- **Flow:** When attempting to remove the service, the system checks for future appointments. If
  found, the removal is _blocked_.
- **UI Message:** "Cannot remove this service. Dr. Smith has 3 upcoming appointments for it. Please
  reassign or cancel these appointments first."
- **Pros:** Prevents orphaned appointments. Guarantees data integrity.
- **Cons:** High friction for Admins.

### Option B: Soft Delete / Grandfathering (Flexible)

- **Flow:** The service is removed from the doctor's _public booking availability_ (new patients
  can't book it), but it remains listed on the backend strictly for the active appointments until
  they are completed.
- **Mechanism:** Add a status flag to the `DoctorServices` junction table (e.g.,
  `isActive: boolean`).
- **Pros:** Zero disruption to existing patients.
- **Cons:** Increases query complexity.

### Option C: Automatic Reassignment / Notification (Complex)

- **Flow:** The system allows the removal. It places the affected appointments into a
  "Displaced/Needs Attention" queue.
- **Action:** Admins are notified immediately to reassign the patient to another doctor offering the
  service, or contact the patient to cancel/reschedule.
- **Pros:** Keeps doctor profiles perfectly clean immediately.
- **Cons:** Requires building a "needs attention" queue UI and robust notification logic.

## Recommended Approach: Option B or C

- **If developer capacity is available:** Implement a mix of B and C. Soft-delete the service
  capability so no new bookings occur, and flag the existing appointments so admins know to address
  them if needed.
- **Immediate Action Plan (for later):**
    1.  Decide on the business logic rule (A, B, or C).
    2.  Update `FINAL-COMPLETE-SCHEMA.sql` if a new status column or queue table is needed.
    3.  Modify the Admin API endpoint that unlinks a doctor from a service to handle the conditional
        check.
    4.  Update Admin UI to handle the response (error message vs success with warnings).
