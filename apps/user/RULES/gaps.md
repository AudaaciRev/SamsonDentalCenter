# System Gaps & Roadmap (Prioritized)

This document tracks identified gaps and upcoming features for the Primera Dental platform, refined based on user feedback.

## 🔴 HIGH PRIORITY (MUST DO)
### 1. Patient Schedule Conflict Check
- **Gap**: The system prevents Dentist double-booking, but not Patient double-booking.
- **Problem**: A patient could book overlapping appointments with two different doctors at the same time.
- **Solution**: Implement a server-side check ensuring a patient has no active/conflicting appointments during the requested time range.

---

## 🟡 MEDIUM PRIORITY (GOOD ADDITIONS)
### 2. Waitlist "Decline" Button
- **Problem**: Patients can currently only "Confirm" or let it "Expire." Letting it expire wastes 25 minutes of clinical time.
- **Solution**: Add a "Decline Offer" button to the notification/email to release the slot instantly for the next person.

### 3. Unverified Guest Cleanup
- **Problem**: Abandoned guest bookings (never email-verified) clutter the database.
- **Solution**: Automatic CRON job to delete unverified guest records after 1 hour.

---

## 🔵 LOW PRIORITY (LATER)
### 4. Strike System Rehabilitation
- **Gap**: The restriction system currently lacks an automated "rehabilitation" flow beyond time-based unlocking.
- **Solution**: Better UI to show patients how many "good" visits they need to clear their strikes.

---

## ⚪ REJECTED / DISCARDED
- **Rush Notice Override**: User prefers the 3-hour global buffer as-is.
- **SMS Notifications**: Not currently needed; sticking with email.
- **Medical File Uploads**: Not needed at this stage; focus on Appointment History instead.
