# User Signup & Authentication OTP Implementation Plan

## Objective

Replace the traditional, multi-tab "Magic Link" email verification flow during User Sign up with a
seamless, inline 6-digit OTP (One-Time Password) confirmation. Keep the user in the same browser tab
without losing context.

## Will this break many things (Impact Assessment)?

**Honest Answer:** **No, this is actually an easier change than the Guest Booking OTP.** Because you
are using Supabase for Authentication, you don't even need to build a custom database table or
backend generator for this. Supabase natively supports 6-digit Email OTPs out of the box. We just
need to change how the frontend handles the signup response.

---

## 1. Flow Comparison

### Current (Magic Link) Flow

1. User enters Email & Password and clicks "Sign Up".
2. System instructs user: "Check your email for a verification link."
3. User opens Email, clicks link.
4. Link opens a _brand new browser tab_, verifies the token, and logs them in.
    - _(Risk: Disorienting UX, loses the original context/tab, often gets blocked by strict email
      security scanners clicking links)._

### Proposed (OTP) Flow

1. User enters Email & Password and clicks "Sign Up".
2. **NEW:** Frontend turns into an "Enter 6-digit code sent to your email" screen.
3. **NEW:** User types the 6 numbers.
4. Frontend calls `supabase.auth.verifyOtp()` and the user is instantly logged in within the _exact
   same tab_.

---

## 2. Backend & Database Configuration (Zero Code!)

You DO NOT need to write new SQL tables or API routes for this.

**Supabase Dashboard Changes:**

1. Go to **Authentication > Providers > Email**.
2. Ensure **Confirm email** is enabled.
3. Go to **Authentication > Email Templates**.
4. Edit the **Confirm signup** template to include the OTP code using the Supabase `{{ .Token }}`
   variable.
    - _Example:_ `Your confirmation code is: {{ .Token }}`

---

## 3. Frontend Changes (`apps/user/`)

1. **Create a Shared `<OtpInput />` Component (High Priority)**
    - Do not build the frontend 6-digit boxes twice! Build one highly-polished React component and
      use it for _both_ Guest Booking and User Signup.

2. **Update the Signup Form Component:**
    - Add a state variable: `const [needsOtp, setNeedsOtp] = useState(false);`
    - When the user submits the signup form, call `supabase.auth.signUp({ email, password })`.
    - Instead of showing a "Check your email" success alert, `setNeedsOtp(true)` to render the
      `<OtpInput />` view.

3. **Verify the OTP:**
    - When they type the 6 digits, call:
        ```javascript
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp_code,
            type: 'signup',
        });
        ```
    - On success, route them to the dashboard or profile setup.

---

## 4. UX Best Practices & Edge Cases

Since you are standardizing on OTP, follow the exact same UX Laws defined in your Guest plan:

### 1. State Recovery & Rehydration

- If a user refreshes the page while on the OTP step, remember their email in `sessionStorage` so
  you can pop the OTP modal right back up.

### 2. Form Factor Optimizations (Laws of UX)

- **Auto-Focus & Paste:** If they paste "123456", split it across the 6 boxes and automatically
  submit.
- **Mobile Friendly:** Use `type="text" inputMode="numeric" pattern="[0-9]*"` so the user's phone
  displays the giant number pad (Fitts's Law).

### 3. Clear Error States

- **Wrong Code:** Shake the inputs, turn red, clear the inputs, and focus box #1.
- **Expired Code:** If the OTP expires, offer a clear "Resend Code" button with a 30-second cooldown
  timer to prevent them from spamming your Supabase email quota.
