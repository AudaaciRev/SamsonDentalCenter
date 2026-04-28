# Roadmap: Guest Booking Version 2

This document prioritizes future enhancements to the Guest Booking and OTP system, categorized by their criticality.

## 🔴 MUST DONE (High Priority: Security & Stability)
These items are essential for a robust production environment and to prevent abuse.

1. **IP-Based Rate Limiting**
   - **Why**: Prevents a single malicious user from requesting thousands of OTP emails/SMS, which would burn through your Resend/PhilSMS credits.
   - **Cost**: Low (Middleware implementation).

2. **OTP Brute-Force Protection**
   - **Why**: A 6-digit code has 1,000,000 combinations. An automated script could guess it given enough attempts. You should lock the email/token after 5 failed attempts.
   - **Cost**: Low (Database counter).

3. **Database Cleanup Job**
   - **Why**: Currently, `guest_otp_codes` grows every time someone tries to book. You need a background job (CRON) to delete entries older than 24 hours.
   - **Cost**: Medium (Needs a scheduled routine).

4. **Production Email/SMS Domain Verification**
   - **Why**: Using `onboarding@resend.dev` or unverified domains increases the chance of notifications landing in SPAM.
   - **Cost**: Low (Dashboard configuration).

---

## 🟡 OPTIONAL (Enhancements: UX & Polish)
These items improve the user experience and internal operations but are not strictly required for launch.

1. **SMS Verification Option**
   - **User Choice**: Allow the guest to choose between Email OTP or SMS OTP (since PhilSMS is now integrated).

2. **Session Continuity (Save Progress)**
   - **Context**: If a user accidentally closes their browser tab while waiting for an email, they shouldn't lose their time slot. Store progress in `sessionStorage`.

3. **Advanced UI Feedback**
   - **Confetti**: Add a celebration animation upon successful verification.
   - **Input Shake**: Shake the 6 boxes and turn them red if a code matches but is incorrect.

4. **Staff Webhooks (Slack/Discord)**
   - **Notification**: Instantly alert the clinic staff via Slack or Discord when a new Guest Booking is officially verified and created.

5. **Conversion Analytics Dashboard**
   - **Visibility**: Track how many users click "Book", how many receive the OTP, and how many actually finish. This helps you see if the OTP step is causing too many people to give up.
