# Future Improvements: Guest Booking & Security

Following the successful implementation of the OTP flow and frictionless account creation, here are high-level recommendations for future enhancements to further harden the system and improve UX.

## 🛡️ Security & Anti-Spam
- **IP-Based Rate Limiting**: Limit the number of OTP requests from a single IP address within an hour to prevent malicious script-kiddies from burning your Resend credits.
- **OTP Brute-Force Protection**: Lock verification for an email address after 5 failed attempts.
- **Database Cleanup Job**: Implement an automated CRON job to delete entries from `guest_otp_codes` that are older than 24 hours.
- **CAPTCHA**: Add a "Turnstile" (Cloudflare) or reCAPTCHA to the initial "Send OTP" step if bot traffic increases.

## 💎 User Experience (UX) Enhancements
- **SMS Verification**: Add an option to verify via SMS (using your PhilSMS integration) for users who prefer phone notifications over email.
- **Session Continuity**: Store the guest's progress (selected service, date, time) in `sessionStorage` so if they accidentally close the tab during verification, they can resume instantly.
- **Email Template Polish**: Convert the current HTML templates to a more modern, responsive design that works perfectly on Dark Mode email clients.
- **Verification Success Confetti**: Add a subtle confetti animation upon successful OTP verification to celebrate the booking completion.

## ⚙️ Architectural Scaling
- **JWT-Based Verification Tokens**: Instead of storing the `verification_token` in the database, use a signed, short-lived JWT. This reduces database lookups for the final booking step.
- **Webhook Notifications**: Trigger a Slack or Discord webhook when a new guest booking is verified, so the clinic staff can approve it even faster.
- **Analytics Tracking**: Track how many guests start the OTP flow vs. how many complete it to identify friction points in the booking funnel.

## 📧 Email Reliability
- **Custom Domain Verification**: Ensure `primeradental.com` is fully verified in your Resend dashboard to avoid emails being flagged as "via resend.net" or landing in spam.
- **DMARC/DKIM/SPF**: Verify these records are correct for your domain to ensure maximum deliverability (10/10 score).
