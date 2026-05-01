# Guest Booking OTP Implementation Plan

## Objective

Replace the vulnerable post-booking "Magic Link" system with a pre-booking OTP (One-Time Password)
verification flow for guest users, and introduce a "Frictionless Account Creation" prompt upon
successful booking.

## Will this break many things? (Impact Assessment)

**Honest Answer:** **No, it will not break your core architecture, but it requires a moderate
rewrite of the Guest Frontend Flow.**

- **Database Impact:** Minimal. We only add one small table for OTP codes. `appointments` remains
  entirely untouched.
- **Backend Impact:** Moderate. We add two new endpoints (Send OTP, Verify OTP) and add an OTP check
  to the existing guest booking endpoint.
- **Frontend Impact:** High. The guest booking form needs a new step or modal to type the 6-digit
  code. The success screen needs a new "Create Password" UI.

This is a very safe change because it hardens the _entry point_ (the door) without touching the
_storage_ (the room).

## Is this a "Major Schema Change"?

**Absolutely not.** You only need to create **ONE** new, isolated table (`guest_otp_codes`).

- You do **not** need to modify the `appointments` table.
- You do **not** need to edit `profiles` or foreign keys.
- The new table is completely disposable—it just holds a 6-digit number for 10 minutes and then it
  can be ignored or cleaned up. It will not affect any of your complex two-tier logic or scheduling
  algorithms.

## Should I do this? (OTP vs. Magic Link)

To help you decide if it's worth the effort, here is an honest comparison of your current Magic Link
vs the proposed OTP.

### The Current: Post-Booking Magic Link

**How it works:** Anyone can type a name and email, and the appointment is instantly saved. The
system emails them a "Magic Link" to manage that appointment.

- **Pros:**
    - Incredibly fast for the user. Zero friction.
    - Easiest to code.
- **Cons (Major Risks):**
    - **Bot Spam:** A malicious script could book up your entire calendar in 30 seconds with fake
      emails, taking your clinic offline for real patients.
    - **Typos:** If a real patient accidentally types `johndoe@gmial.com`, the appointment is still
      booked, but they never get the magic link, never get reminders, and might no-show.
    - **UX Context Loss:** When they click the Magic Link to confirm or cancel, it forces open a new
      browser tab, taking them away from their original booking flow.

### The Proposed: Pre-Booking OTP (One-Time Password)

**How it works:** They type their info, but the database _does not save the appointment yet_. It
emails them a 6-digit code. They must type that code on the screen before the appointment is saved.

- **Pros:**
    - **100% Bot Immunity:** Bots cannot guess the 6-digit code sent to an email they don't own.
      Your calendar is perfectly safe.
    - **Data Integrity:** It guarantees every single guest email in your database is real and
      spelled correctly (because they had to receive the code). No more typos.
    - **Inline Experience:** Type code -> Success. They never leave the browser tab they started the
      booking in.
- **Cons:**
    - **Increased User Friction:** Adds ~15 seconds to the booking process.
    - **Development Effort:** You have to build the UI for the 6 boxes and the extra backend
      endpoint to verify them.

**Final Verdict:** If your clinic starts getting traction, you _will_ get spammed by bots. The Magic
Link method is a ticking time bomb for scheduling apps. **Yes, you should implement the OTP flow.**
It is the industry standard for unauthenticated bookings (like how Stripe or Airbnb verify guest
emails) because it guarantees data integrity while preserving your database from attacks.

---

## 1. Flow Comparison

### Current (Vulnerable) Flow

1. User selects Time.
2. User enters Name, Email, Phone.
3. User clicks "Book Appointment".
4. Database saves appointment.
5. System emails a magic link for future management. _(Risk: Bots can spam step 3 endlessly)._

### Proposed (Secure) Flow

1. User selects Time.
2. User enters Name, Email, Phone and clicks "Continue".
3. **NEW:** System emails a 6-digit OTP and shows an "Enter Code" screen.
4. **NEW:** User enters OTP.
5. System verifies OTP and finalizes the booking in the database.
6. **NEW:** On the Success Screen, the user is asked: _"Want to skip this next time? Create a
   password to save your profile."_

---

## 2. Database Schema Changes

We need a temporary table to store the 6-digit OTPs before the appointment is actually created.

```sql
CREATE TABLE IF NOT EXISTS guest_otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup when verifying
CREATE INDEX IF NOT EXISTS idx_guest_otp_email ON guest_otp_codes(email);
```

_(Note: The existing `guest_action_tokens` table used for magic links can be kept specifically for
guest cancellation links if you still want them to cancel via email later, or it can be deprecated
if you force them to make an account to manage bookings.)_

---

## 3. Backend Changes (`apps/api/`)

1.  **`POST /api/auth/guest/send-otp`**
    - **Payload:** `{ email, name }`
    - **Action:** Generates a 6-digit random number, saves it to `guest_otp_codes`, and sends an
      email via your email provider.
2.  **`POST /api/auth/guest/verify-otp`**
    - **Payload:** `{ email, otp_code }`
    - **Action:** Checks the table. If valid and not expired, sets `is_verified = true`. Returns a
      temporary `verification_token` (e.g., a short-lived JWT).
3.  **Update `POST /api/appointments/guest` (The Booking Endpoint)**
    - **Change:** Must now accept the `verification_token` from step 2.
    - **Action:** Validates the token before allowing the `INSERT` into the appointments table. If
      no token, reject with `403 Forbidden`.
4.  **`POST /api/auth/guest-to-user` (Frictionless Upgrade)**
    - **Payload:** `{ email, password, verification_token }`
    - **Action:** Calls Supabase Admin Auth to create a real user account using the already verified
      email, triggering standard user initialization.

---

## 4. Frontend Changes (`apps/user/`)

1.  **Guest Booking Form (Patient Info Step):**
    - When the user submits their data, instead of calling the booking endpoint, call `/send-otp`.
    - Swap the UI to an OTP input component (6 small boxes).
    - On OTP submit, call `/verify-otp`. Upon success, immediately call the booking endpoint and
      route to the Success Page.
2.  **Success Page (Frictionless Signup):**
    - Display the booking confirmation exactly as usual.
    - Below it, add a card: **"Secure your booking & save your details for next time."**
    - Add a simple password input field and a "Create Account" button.
    - Behind the scenes, this links their newly booked appointment to their new profile.

## Honest Assessment & Execution Strategy

Do this in two phases so it doesn't overwhelm you:

- **Phase 1:** Just implement the Send OTP and Verify OTP on the frontend, blocking the booking
  until the email is verified.
- **Phase 2:** Add the "Password Creation" upgrade on the success screen later.

## 5. OTP UX Best Practices & Edge Cases (Crucial)

To ensure the OTP step isn't frustrating, implement these standard patterns:

### 1. State Recovery (Accidental Tab Close)

- **The Risk:** The user switches to their email app, accidentally closes the booking tab, and loses
  their 5-minute hold and progress.
- **The Fix:** Store `otp_pending: true` and the temporary `booking_payload` in `sessionStorage` or
  `localStorage`. If they reopen the site within their 5-minute hold window, immediately pop the OTP
  modal back up so they can finish without starting over.

### 2. Seamless Input (UI/UX Laws)

- **Auto-Advance:** Use 6 individual input boxes. When they type a number, auto-focus the next box
  automatically.
- **Paste Support:** If they copy "123456" from their email and paste it into the first box,
  auto-fill all 6 boxes and automatically submit the form.
- **Numeric Keypad:** On mobile, set `inputMode="numeric"` and `pattern="[0-9]*"` on the inputs so
  the phone opens the large, easy-to-tap number pad instead of the standard alphabet keyboard
  (Fitts's Law).

### 3. Handling Expirations & Spam

- **Resend Cooldown:** Disable the "Resend Code" button with a countdown (e.g., 30 seconds). This
  prevents impatient users from spam-clicking it if the email takes 5 seconds to arrive, which would
  spam your email provider.
- **Hold Timer Grace:** If the 5-minute slot hold expires _while_ they are hunting for the code in
  their email, don't throw a generic 500 error. Show a clear, polite message: _"Your time slot
  expired while waiting. Please select a new time,"_ and route them back to the calendar step while
  preserving their patient info.

### 4. Clear Error States

- **Wrong Code:** If the code is wrong, shake the input boxes slightly, turn the borders red,
  instantly clear the inputs, and auto-focus the first box again. Do not reset their entire booking
  flow just because of a typo.
