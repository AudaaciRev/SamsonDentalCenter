# Patient Profiles System Implementation Plan

## Objective

Enhance the user booking flow by allowing users to manage multiple "Patient Profiles" under a single
account. Instead of the current "Book for self" vs "Book for others" manual entry, users will select
from their saved profiles or add a new one.

## Current State Analysis

Currently, when booking an appointment, the user is presented with a choice to book for themselves
or someone else. If it's for someone else, they must manually enter the details every time.

## Proposed System

1.  **Default Profile:** Every registered user has a default profile (themselves).
2.  **Additional Profiles:** Users can add multiple profiles (e.g., family members).
3.  **Booking Flow:** During the "Patient Info" step of booking, the user selects from a list of
    predefined profiles or clicks "Add New Profile".
4.  **Database Updates:** We need a way to link secondary patients/dependents to a primary `User`
    account.

## Database Schema Changes (Proposal)

We need a `patient_profiles` table (as dependents/family members) that links back to the main
`profiles` table. A dedicated table is cleaner because dependents generally do not need login access
(i.e., they won't have an `auth.users` record).

```sql
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    suffix TEXT,
    date_of_birth DATE,
    relationship TEXT, -- e.g., 'Child', 'Spouse', 'Other'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

_(Alternatively, adapt the current `Patients` or `Users` schema based on exact existing structure.
We must verify if "dependents" should be distinct entities)._

## Backend Changes (API) (`apps/api/`)

1.  **GET `/api/users/:id/profiles`**: Retrieve all profiles associated with an account (including
    the main user as the default profile).
2.  **POST `/api/users/:id/profiles`**: Add a new dependent profile.
3.  **PUT/DELETE `/api/users/:id/profiles/:profileId`**: Manage existing profiles.
4.  **Update Appointment Creation Endpoint**: The booking API must accept a `profileId` instead of
    raw name strings for "other" patients, ensuring the appointment is linked to the correct profile
    context.

## Frontend Changes (User App - `apps/user/`)

1.  **Booking Step Redesign (Patient Info):**
    - Fetch and display a list of cards for available profiles (`ServiceCard` style but for
      patients).
    - Highlight the default/primary user profile.
    - Provide an intuitive "Add New Patient" card that opens a standard form.
2.  **Profile Management Hub:**
    - In the user dashboard/settings, add a "Family & Dependents" or "Linked Profiles" section to
      manage these outside of the booking flow.

## Honest Assessment & Suggestions

- **Pros:** Significantly reduces friction for returning users booking for family members. Highly
  professional UX (standard in modern health apps).
- **Cons:** Increases data model complexity. We must ensure HIPAA/privacy compliance if medical
  notes are attached to dependents.
- **Recommendation:** Keep the dependent profile simple (Name, DOB, Relationship). Avoid creating
  full duplicate user accounts for dependents unless they need to log in separately later.

## Execution Steps

1.  Finalize schema decision (Dedicated table vs Relationship).
2.  Create SQL Migration.
3.  Implement Backend CRUD routes.
4.  Build frontend "Profile Selector" component.
5.  Refactor booking flow to integrate the selector.
