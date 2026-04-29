# Admin Workflow: User Creation Strategy

This document outlines the improved strategies and plans for how Admins will handle the creation of
different user types (Doctors, Staff, and Patients). It separates the logic between mandatory staff
accounts and flexible patient accounts, mitigating risks like duplicate walk-in records.

## 1. Doctors & Staff (Mandatory Accounts)

Doctors and administrative staff _must_ have associated login accounts for security, role
management, and audit trailing.

### Workflow:

1. **Creation:** Admin creates the profile inputting basic details (Name, Email, Role, etc.). By
   default, the account is created in an "Invited" or "Pending Setup" state.
2. **Notification:** The system automatically sends an email to the newly created employee with a
   "Create Password" link.
3. **Activation:** The employee clicks the link, sets their password, and their account becomes
   active and ready for login.
4. **Resend Invite:** If the link expires, the Admin can go to the employee's "Security" tab and
   click "Resend Setup Link".

---

## 2. Patients (Flexible "Late-Binding" Accounts)

Patients should not be forced to provide an email or create an account, specifically to accommodate
walk-in scenarios.

### The "Stub" Profile Workflow:

1.  **Creation:** Staff creates a "Stub" profile (clinical record only) for walk-ins.
2.  **Similarity Intercept (The Guard Dog):**
    *   **Triangulation Check:** As fields are filled, the system checks for exact matches on Phone/Email AND fuzzy matches on Name/DOB to catch typos (e.g., "Jon" vs "Jonathan").
    *   **The Intercept:** If a match is found, a "Potential Existing Record" modal displays the masked phone and DOB for staff verification.
3.  **Email Policy (Family-First Rule):**
    *   **Standalone Profiles:** Must have a unique email.
    *   **Duplicate Detection:** If an entered email exists, "Create Anyway" is **disabled**. Staff must either link as a **Dependent** or use a different email.
4.  **Late-Binding & The "DOB Gate":**
    *   When a patient clicks an account setup link, they must pass a **"DOB Gate"** (entering their birthday to verify identity) before they can set a password. This prevents data leaks if the email was sent to the wrong person.
    - **Note in UI:** In the admin panel, refer to these as "Unregistered Patient" or "Portal
      Access: Not Set Up" instead of "Stub" to ensure clean, professional language for non-technical
      staff.
2. **Booking:** This profile acts as a "Stub" profile. The Admin/Secretary can now book appointments
   on behalf of this patient.
    - **Audit Trail:** Appointments booked on behalf of a stub patient must be flagged with
      `booked_by: staff` (or identifying the specific staff member). When the patient later
      activates their account, these appointments will appear in their history tagged as _"Booked by
      clinic"_.
3. **Admin "Late Email Addition" Workflow (Security Tab):**
    - If the patient has **No Email** on file, their "Security" tab will display a prompt:
        > _"No email on file — Please add an email address to enable account creation for this
        > patient."_ The "Send Account Setup Link" button will be disabled or hidden until an email
        > is provided.
    - **The Pre-Save "Email In-Use" Check:** When an Admin adds an email to a Stub profile and hits
      "Save", the backend instantly checks if that email already exists in the auth system.
        - _If completely new:_ Save it to the Stub profile. It remains a Stub
          (`isRegistered: false`).
        - _If the email belongs to an active patient:_ Block the save. Show an Admin error: _"This
          email is already registered to an active patient portal. To combine these records, please
          use the Merge Records utility."_ This prevents accidental detached login states.
    - **The "Send Invite" Trigger:** Saving the email does not create an active account. It simply
      unlocks the "Send Account Setup Link" button in the Admin UI.
    - **The Secure Setup Token:** When the Admin clicks the button, the backend generates a secure
      setup token hardcoded to that specific Stub's `profile_id`. The patient receives an invitation
      email ("Your clinic has invited you to access your patient portal").
    - **The "DOB Gate" (Typo Protection):** To prevent medical data leaks if the Admin typos the
      email address (sending the link to a complete stranger), the setup link must include a
      security gate.
        - When the email recipient clicks the link, they are **not** immediately shown the "Create
          Password" fields.
        - The portal page first asks: _"To access your health records, please verify your identity
          by entering your Date of Birth."_
        - _Result (Stranger):_ A stranger won't know the patient's DOB, fails the check, and is
          blocked. The medical data is secure.
        - _Result (Real Patient):_ The patient enters their correct DOB. The portal then reveals the
          "Create Password" fields to finalize the setup (`isRegistered: true`), securely linking
          them to their existing medical history.
4. **The "Claim Profile" Workflow (Self-Registration Auto-Linking):** If a user provides an email
   during a walk-in but declines the setup invite, they remain a stub. When they later attempt to
   self-register via the portal using that exact same email, the following flow occurs:
    - **1. Initial Authentication:** The user signs up and completes email verification (e.g., OTP).
      They now have a verified `auth.uid`, but no attached patient data yet.
    - **2. Database Interception Check:** Immediately after OTP verification, the backend queries
      the profiles table: Is there a profile where email matches AND is 'Stub'?
        - _If No:_ Proceed as normal. Create a brand new, blank patient profile.
        - _If Yes:_ Trigger the Interception phase.
    - **3. The Verification UI Prompt:** Route the user to a "Verify Identity" screen before letting
      them into the main portal.
        - _UI Copy:_ "We found an existing clinic record associated with this email. To protect your
          medical history, please verify your identity by entering your Date of Birth or the Phone
          Number you provided the clinic."
    - **4. The Match & Merge (Transaction):** The user submits their DOB/Phone. If it's a perfect
      match, execute a strict database transaction:
        - Attach the new `auth.uid` to the existing stub record.
        - Change status to Active (`isRegistered: true`).
        - Log the user's explicit consent to the portal's Terms of Service and Data Privacy
          agreements (storing timestamp and consent version).
        - Commit the transaction and route them to their dashboard. If it fails mid-process,
          immediately roll back.
    - **5. Conflict Handling (Failed Match):** If the secondary identity check fails (e.g., wrong
      DOB after 3 attempts):
        - Do not block them. Create a brand new, empty profile attached to their `auth.uid`.
        - Silently flag the original stub in the Admin dashboard with a "Data Conflict" / "Flagged
          for Review" tag so staff can resolve the typo during their next visit.
    - **Active Account Conflict:** If the email matches an already _active_ account, reject
      registration and display: _"An account with this email already exists — please log in or reset
      your password."_
    - **Transaction Safety (Rollback):** The match & merge process must be wrapped in a database
      transaction. If the process fails mid-way (e.g., server error), it must immediately roll back.
      A patient must either be completely linked or remain purely a stub with no partial state.

---

## 2.5 Link Expiry & Resend Rules (For All User Types)

Setup links sent via email (for Doctors, Staff, or Patients) must adhere to a strict expiration
policy for security and anti-spam measures:

- **Duration:** Setup links expire exactly **48 hours** after being generated.
- **Single-Use:** Setup tokens are invalidated immediately after first use (e.g., successful
  password creation) to prevent replay attacks.
- **Expiry UX:** If a user clicks an expired link, they must be routed to a clear error page
  stating: _"Your account setup link has expired for security reasons. Please contact the clinic or
  request a new link."_
- **Resend Cooldown:** To prevent email spam and abuse, resend requests (triggered by Admins via the
  "Security" tab) are rate-limited to **once every 15 minutes** per recipient.

---

## 3. Duplicate Patient Record Prevention

A major risk with optional emails and walk-in patients is staff accidentally creating multiple
records for the same person over time.

### The Problem:

A walk-in patient gets registered today. They return next month, and a different staff member
forgets to search for them, opting to just create a new record.

### The Solution: Duplicate Detection

Implement a pre-creation validation check in the "Add Patient" form.

**Check Criteria:** Before submitting the final creation request, the system checks the database for
existing patients matching a combination of:

- `First Name + Last Name` AND `Birthdate`
- OR matching `Phone Number`
- OR matching `Email Address`

**UX Flow (Duplicate Warning Modal):** If a match is found:

1. Pause the creation process.
2. Show a warning prompt:
    > _"Possible duplicate found: A patient matching this Name and Birthdate (or Phone Number/Email)
    > already exists."_
3. Provide actions:
    - **[View Existing Record]**: Takes the staff member to the existing patient's profile to book
      the appointment there.
    - **[Create Anyway]**: Allows the staff to override the warning if it's genuinely two different
      people (e.g., father and son with similar names/shared numbers).

### The Fallback: "Merge Records" Utility

Despite warnings, staff may occasionally bypass alerts and create duplicate profiles. To resolve
this, an Admin "Merge Records" utility must be built:

- **Function:** Allows an Admin to select two profiles: a "Source" (to remove) and a "Target" (to
  keep).
- **Data Transfer:** Safely migrates all appointment history, medical logs, and attached
  `patient_profiles` (dependents) from the Source to the Target.
- **Cleanup:** Archiving or soft-deleting the Source profile to maintain database consistency and
  audit history while cleaning up the UI.

---

## 4. Family & Dependent Workflow Integration

The system already has a planned feature for users to manage multiple "Patient Profiles"
(dependents) under a single account (tracked in `user_booking_patient_profiles.md`). We must align
the Admin UI and the Walk-in/Self-Registration logic with this database architecture
(`patient_profiles` linked to a main `profiles` table).

### Admin Creation (Walk-in Families):

If a mother walks in with two children:

1. **Primary Setup:** The Admin creates the Mother as a standard Patient (either as a Stub or Active
   user with an email).
2. **Adding Dependents:** In the Admin UI (from the Mother's profile view), the Admin clicks **"Add
   Dependent/Family Member"**.
    - This creates records in the `patient_profiles` table linked to the mother's ID.
    - **Crucially:** Dependents do _not_ require emails. They exist purely under the Primary's
      umbrella.

### Self-Registration (Auto-Linking Families):

If the mother was registered as a Stub and later self-registers via the digital portal:

1. **Auto-Link Trigger:** The system matches her email, converts her Stub to an Active account.
2. **Dependent Carry-Over:** Because her children's `patient_profiles` are tied to her database ID,
   they instantly appear in her Patient Portal under her "Family & Dependents" section. No extra
   linking step is needed for the children.

### The "Duplicate Warning" Edge Case for Families:

- If staff input the Mother's phone number exactly for her 10-year-old child:
- The Duplicate Checker will flag it (matching phone number).
- Instead of just warning, the modal should offer a third option: **[Link as Dependent to Existing
  Patient]**. This allows staff to quickly nest the child under the mother's account right from the
  warning screen.

---

## Technical Action Items:

- [ ] Update `isRegistered` or `accountStatus` enums in the User/Patient schema to differentiate
      between 'Stub' and 'Active' accounts.
- [ ] Implement the `checkDuplicatePatient` API endpoint (checking Name+DOB, Phone, and Email).
- [ ] Implement the `Auto-Link Profile` logic during the self-registration flow if the email matches
      an existing `isRegistered: false` account, ensuring it is wrapped in a **database
      transaction**.
- [ ] Include **TOS & Privacy policy consent logging** inside the Auto-Link transaction.
- [ ] Define the `48-hour expiration` logic for all account setup tokens (JWT or Database token).
- [ ] Implement logic to **invalidate tokens immediately after their first successful use**.
- [ ] Create the `Expired Link` error page for the frontend.
- [ ] Implement a `15-minute cooldown` rate limit on the "Resend Setup Link" API endpoint.
- [ ] Update the Booking schema to include a `booked_by` field (referencing the Admin/Staff ID) and
      implement the frontend logic to display _"Booked by clinic"_ in the patient's history.
- [ ] Update the Admin "Add Patient" form UI with the Duplicate Detection Modal.
- [ ] Enhance Duplicate Detection Modal to include the **[Link as Dependent]** action.
- [ ] Develop the Admin **"Merge Records" utility** (Backend logic for transferring associations and
      Frontend UI).
- [ ] Update Admin Patient dashboard to support adding/viewing child `patient_profiles`.
- [ ] Log "Create Anyway" overrides with Staff ID and timestamp for audit trailing when bypassing
      the Duplicate Detection Modal.
- [ ] Update the "Security" tab UI in the Admin Patient View to handle the "No Email" validation
      state.
- [ ] Implement secondary identity verification (DOB/Phone prompt) during the self-registration
      auto-link flow.
- [ ] Implement a "Flagged for Review" state/UI in the Admin dashboard for when an email matches a
      stub, but the secondary identity check fails.
- [ ] Implement Pre-Save "Email In-Use" check on the Admin patient edit route to block saving emails
      already tied to active accounts.
- [ ] Implement the "DOB Gate" security step on the frontend portal for incoming Account Setup links
      to prevent typo-based data leaks.
