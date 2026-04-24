# Admin Portal - Navigation & Structure Architecture

Based on your ideas, your plan for the Admin Portal is heading in the exact right direction. An
Admin portal should be the "God View" of the clinic.

Here is a recommended, highly organized navigation structure for the Admin App, including your ideas
and some best-practice additions for medical/dental software.

---

## Recommended Main Navigation Structure

### 1. 📊 Dashboard (Keep)

- **Overview:** High-level metrics (Today's revenue, new patients, displaced appointments needing
  attention, system alerts).

### 2. 👨‍⚕️ Doctors (Keep)

- **Profile:** Basic info, specialization, bio.
- **Schedule:** Global Weekly Routine & Exceptions (Time/Date Blocks).
- **History/Activity:** Past appointments handled by this doctor.
- **Security (New Sub-nav):** Account management specific to this doctor (e.g., Reset Password,
  Disable Account, Change Role). _Keep account management tied to the specific user rather than a
  global "Accounts" page._

### 3. 👩‍💼 Staff / Secretaries (New)

_Instead of just "Secondary", call it "Staff" so you can manage Admin and Secretary accounts here._

- **Profile:** Basic info, contact details.
- **Security / Access:** Reset password, activate/deactivate account.
- **Audit / Activity (Replaces Schedule):** Secretaries don't have "schedules" like doctors, so
  instead, show a log of their actions (e.g., "Booked 5 appointments today", "Cancelled Appointment
  #1234").

### 4. 🫂 Patients / Users (New)

- **Directory:** List of all registered patients and guests.
- **Profile:** Patient details, contact info.
- **Appointments (Schedule):** Upcoming bookings for this specific patient.
- **History & Records:** Past appointments, no-show counts, cancellation counts.
- **Restrictions Management:** Since your database has a `is_booking_restricted` flag for users with
  too many no-shows, Admins need a place to manually lift or enforce these restrictions.

### 5. 🦷 Services (New)

- **Service Catalog:** Add/Edit/Delete services (e.g., "Teeth Cleaning", "Root Canal").
- **Pricing & Duration:** Update costs and how long the appointment takes.
- **Tier Management:** Mark services as `general` (requires approval) or `specialized` (requires
  approval) as per your Two-Tier database schema.

### 6. ⚙️ Clinic Settings (New)

- **General Info:** Update Clinic Name, Address, Contact details (powers the website).
- **Global Constants:** Start/End hours for the clinic itself, deposit requirements.
- **Clinic Holidays:** Add dates where the entire clinic is closed (e.g., Christmas).
- **Health Check / System Status:** View database connection health, email service limits, etc.

### 7. 🛡️ System Audit Logs (Recommended Addition)

_Since you have an `audit_log` table in your database schema, you should expose it to the Admin._

- **Global Activity Timeline:** A master list showing _everything_ that happens in the system (e.g.,
  "Admin X changed Clinic settings", "Secretary Y displaced 5 appointments", "Patient Z cancelled
  their booking"). This is crucial for HIPAA/Privacy compliance and debugging who made a mistake.

---

## Why this Structure Works well:

1. **Contextual Account Management:** By putting password resets inside the `Profile -> Security`
   sub-tab for Doctors, Staff, and Patients, you don't need a massive, confusing "Account
   Management" page. You just go to the person you want to manage.
2. **Clear Domains:** Services, Settings, and Staff are cleanly separated.
3. **Database Alignment:** This structure perfectly matches your `FINAL-COMPLETE-SCHEMA.sql`
   (Services, Profiles, Audit Logs, Settings).

**What do you think of this layout?** It accommodates all your ideas while keeping the sidebar clean
and intuitive.
