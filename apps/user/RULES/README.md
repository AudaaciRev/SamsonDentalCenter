# Primera Dental - Rule System (Source of Truth)

This directory serves as the definitive guide to the business logic, constraints, and workflows for the Primera Dental platform. 

## 🗺️ Navigation
- [**Guest Flow**](./guest/README.md): Rules for non-authenticated users.
- [**User Flow**](./user/README.md): Rules for registered patients.
- [**Identified Gaps**](./gaps.md): Roadmap for future fixes and features.

---

## 🏗️ Core Architecture Patterns

### 1. Service Tiers
The system operates on a two-tier service model:
- **General Services**: Simple procedures (e.g., Cleaning, Scaling). Open to all. **Requires manual admin approval.**
- **Specialized Services**: Complex procedures (e.g., Surgery, Orthodontics). **User-only**. Requires manual admin approval.

### 2. Dentist Assignment Strategy
Doctors are assigned based on a "Tier Filter + Skillset + Least Busy" hierarchy:
1. **Skillset**: If a dentist is explicitly enrolled in a service, they must match perfectly.
2. **Tier**: If not enrolled, "Both" tier doctors can handle both General and Specialized, while General-tier doctors are restricted to General services.
3. **Availability**: Checks Shift schedules, Active Appointments, and **Slot Holds** (10-minute temporary locks).
4. **Load Balancing**: Among equal candidates, the system picks the dentist with the fewest appointments that day.

### 3. Waitlist Anti-Abuse (Rule #6)
To ensure fairness and clinical safety, the waitlist is strictly controlled:
- **Global Limit**: Max 3 active waitlist entries per patient account.
- **Daily Cap**: Max 1 waitlist entry per Service per Day (prevents "time-boarding").
- **Safety Buffer**: Minimum **3-hour notice** required. A slot opening 1 hour before will NOT be offered.
- **Claim Window**: Patients have **25 minutes** to claim a notified slot before it cascades to the next person.

---

## 🛡️ Policy Enforcements
- **Reschedule Limit**: Only 1 reschedule per appointment id is allowed.
- **24-Hour Notice**: Cancellations or reschedules with less than 24 hours notice are marked as `LATE_CANCEL`.
- **Strike System**: 3 No-Shows or 3 Cancellations trigger account restrictions (5-day booking window limit).

---

## 🚀 Roadmap / Pending Rules (To-Do Later)
- **Duplicate Appointment Prevention**: Prevent the same patient from booking the same service at the same time/day, even if with different doctors. (Currently, only the doctor is protected from double-booking).
