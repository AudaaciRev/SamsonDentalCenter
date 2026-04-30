# Implementation Plan: Admin User Creation Strategy

This document maps the planned "Admin User Creation Strategy" to the current codebase implementation and outlines the specific changes required to bridge the gap.

## 1. Database Schema Changes (`d:\webApp\BLUEPRINT\BACKEND\FINAL-COMPLETE-SCHEMA.sql`)

### Current State
- `profiles` table has `id`, `email`, `full_name`, `phone`, `role`.
- `appointments` table has `patient_id`, `dentist_id`, `service_id`, `guest_email`, `source`, etc.
- No concept of "Stub" vs "Active" account status.
- No `booked_by` field on `appointments` to track which staff member booked a walk-in/stub appointment.
- No `account_setup_tokens` table for the 48-hour expiration logic.

### Required Changes
1. **[MODIFY] `profiles` Table:**
   - Add `is_registered BOOLEAN DEFAULT false` (or an `account_status` enum).
   - Make `email` nullable or provide a default if `is_registered` is false, to support purely stub profiles with no email.
2. **[MODIFY] `appointments` Table:**
   - Add `booked_by UUID REFERENCES profiles(id)` to audit which staff member created the appointment for a stub/walk-in.
3. **[NEW] `account_setup_tokens` Table:**
   - Create a table to store secure setup tokens: `id`, `profile_id`, `token`, `expires_at`, `used_at`, `created_at`.

---

## 2. API & Backend Services

### Current State
- `quickRegisterPatient` in `apps\api\src\services\admin.service.js` inserts a `patient` profile but enforces a unique check on email/phone and fails immediately. It does not handle Stubs vs Active.
- No duplicate detection endpoint (`checkDuplicatePatient` is missing).
- No auto-linking logic during self-registration in `auth.controller.js` or `auth.service.js`.

### Required Changes

#### [MODIFY] `apps\api\src\services\admin.service.js`
- **Update `quickRegisterPatient`**:
  - Support creating a "Stub" profile (`is_registered: false`).
  - **Email Conflict Handling**: If an email is provided that already exists in the `profiles` table, the service must not throw a generic error. It should return a `CONFLICT_RESOLUTION_REQUIRED` payload containing the existing profile's name and registration status.
  - **Conditional Processing**:
    - If `resolution: 'LINK_DEPENDENT'`: Create the new record in `patient_profiles` (or as a dependent) linked to the existing `profile_id`.
    - If `resolution: 'FORCE_STUB'`: Create a new standalone record in `profiles` but **nullify the email field** to prevent unique constraint violations while allowing the registration to proceed.
- **Add `checkDuplicatePatient(firstName, lastName, dob, phone, email)`**:
  - Implement a loose matching algorithm to flag potential duplicates and return them to the frontend before creation.
- **Add `mergePatientRecords(sourceId, targetId)`**:
  - Implement the utility to migrate appointments, notes, and delete the source profile.

#### [MODIFY] `apps\api\src\controllers\admin.controller.js`
- **Expose `checkDuplicatePatient` endpoint** to the frontend for the pre-creation warning modal.
- **Expose `mergePatientRecords` endpoint**.
- **Add `sendAccountSetupLink` endpoint** to generate a token, save it to `account_setup_tokens`, and trigger the setup email. Implement the 15-minute cooldown rate limit using Redis or DB checks.

#### [MODIFY] `apps\api\src\services\auth.service.js` (or `auth.controller.js`)
- **Implement Interception & Auto-Linking**:
  - During standard patient registration (after OTP verify), check if the email belongs to a Stub profile (`is_registered: false`).
  - If a Stub exists, return a specific status code (e.g., `409 Conflict - Verify Identity`) to trigger the "DOB/Phone Gate" on the frontend.
- **Implement `verifyAndLinkStub` Endpoint**:
  - Accept `email`, `dob`/`phone`, and attach the new `auth.uid` to the existing Stub record using a strict database transaction. Change `is_registered` to `true`.
  - Log TOS/Privacy Policy consent during this transaction.

---

## 3. Frontend Implementation (Admin/Secretary & Patient Portal)

### Current State
- Admin/Secretary portal does not have a "Duplicate Warning Modal".
- Security tab does not have the "Send Account Setup Link" flow or the "No email on file" validation.
- Patient portal lacks the "Verify Identity" (DOB Gate) screen.

### Required Changes

#### [MODIFY] `apps/admin` & `apps/secretary`
1. **Patient Creation Form (`AddPatientModal`)**:
   - **Similarity Intercept**: Trigger the `checkDuplicatePatient` API on blur or typing delay.
   - **Triangulation Match**: Return exact matches (Phone/Email) and fuzzy matches (Name/DOB).
   - **The Three-Way Resolution Modal**: Implement a specialized conflict UI when the backend flags an existing email.
     - **Option A: "Link as Dependent"**: Automatically sends the `parentId` to the backend to create a linked family record.
     - **Option B: "Continue without Email"**: Re-submits the form to the backend with the email field stripped, creating a "Pure Stub" for the patient.
     - **Option C: "Go Back/Edit"**: Closes the resolution view and focuses the Email input field so the staff can fix a typo or enter a different address.
   - **Potential Match Modal**: Display DOB and masked Phone Number for staff verification.
   - **Strict Blocking**: If email matches an existing account, **DISABLE** "Create Anyway". Force **[Link as Dependent]**.
2. **Merge Records Utility**:
   - Build UI to select "Source" (duplicate) and "Target" (master).
   - Backend logic: Migrate appointments, notes, and family links, then archive the source.

#### [MODIFY] `apps/user` (Patient Portal)
1. **The "DOB Gate" Security**:
   - In `/setup-account/:token`, demand the Date of Birth as the first step.
   - Block password creation if DOB does not match the Stub record.
2. **Auto-Link Transaction**:
   - Wrap `verifyAndLinkStub` in a DB transaction with TOS/Privacy consent logging.

---

## Technical Action Items

- [x] Update `profiles` schema with `is_registered`, `primary_profile_id`, and `is_active`.
- [ ] Implement fuzzy search for `checkDuplicatePatient` (Name/DOB/Phone).
- [ ] Update `AddPatientModal` UI with the Potential Match Modal and masked data.
- [ ] Implement the 48-hour expiration logic and single-use invalidation for setup tokens.
- [ ] Implement 15-minute cooldown rate limit on "Resend Setup Link".
- [ ] Build the "Merge Records" backend logic and frontend utility.
- [ ] Implement the "DOB Gate" verification step in the Patient Portal setup flow.
- [ ] Wrap self-registration auto-linking in a secure database transaction.
