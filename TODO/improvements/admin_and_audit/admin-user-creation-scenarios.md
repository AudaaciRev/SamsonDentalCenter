Scenario 1: The "Pure Stub" (No Email)
The Situation: A 70-year-old patient, Arthur, walks in. He doesn't use email.

Admin Action: The secretary enters "Arthur Pendelton", his phone number, and DOB. Leaves the email blank. Clicks Save.

System Response: Success.

STUB ACCOUNT
STUB1, STUB1v2 -SOLUTION MERGE - SOLUTION 2 SIMILAR DETECTION

GIVE EMAIL=> TYPO BY ADMIN => SEND ADMIN BEFORE CREATING PASSWORD NEED BDAY TO VERIFY

CREATE ACOUNT => MERGE IF USER WANT TO MERGE



Database State: Arthur is saved to the profiles table. isRegistered: false, email: null.

The Result: The secretary can instantly book appointments for Arthur. His portal access remains inactive.

Scenario 2: The "First-Time Email" (New Stub with Email)
The Situation: A new patient, Sarah, walks in and provides her email (sarah@email.com).

Admin Action: The secretary enters her details and email, then clicks Save.

System Response: The database checks sarah@email.com. It finds zero matches. Success.

Database State: Sarah is saved to the profiles table. isRegistered: false, email: sarah@email.com.

The Result: Sarah is still a Stub, but the Admin UI now unlocks the "Send Setup Link" button so the clinic can invite her to the portal.

EMAIL GIVE BY USER2 IS SAME AS USER1 
DETECT BY SYSTEM

OTP FOR A DEPENENCY
EDIT AND CHANGE, ADD AS DEPENDECY, CONTINUE AS A STUB WITH NO EMAIL 


Scenario 3: The "Identical Stub Email" (Two Stubs, One Email)
The Situation: The next day, Sarah's husband, John, walks in. The secretary tries to create a brand new profile for John using sarah@email.com.

Admin Action: Secretary enters John's info, types sarah@email.com, and clicks Save.

System Response: BLOCKED. The database sees this email belongs to Sarah's Stub.

Admin UI Prompt: "The email sarah@email.com is already attached to the unregistered patient 'Sarah'. Would you like to add John as a dependent family member under Sarah's profile?"

The Result: The secretary clicks [Yes, Link as Dependent]. John is saved in the patient_profiles table, linked to Sarah's ID. No duplicate standalone accounts are created.

Scenario 4: The "Active Account Clash" (Stub using Active Email)
The Situation: A patient named Mark already has an active portal account. A new temp secretary doesn't bother searching for him and tries to create a new Walk-In Stub using mark@email.com.

Admin Action: Secretary enters Mark's info, types mark@email.com, and clicks Save.

System Response: BLOCKED. The database sees this email belongs to an Active user (isRegistered: true).

Admin UI Prompt: "This email belongs to the active portal of 'Mark'. To book an appointment for Mark, please [View His Profile]. If this is a family member, you may [Add as Dependent]."

The Result: The temp secretary realizes the mistake, clicks [View His Profile], and books the appointment on Mark's existing account. The database is saved from a ghost record.

Scenario 5: The "Late Registration" (The Missing Scenario)
The Situation: Sarah (from Scenario 2 and 3) finally decides to set up her portal. She goes to your staging domain (e.g., samson.synapsefrost.dev) and signs up using sarah@email.com.

User Action: Sarah enters her email and verifies it via OTP.

with email
stub his1,2,3,4,

without email
stub his1,2,3,4,

account1@
account2@




System Response: The system detects her email matches an existing Stub. It intercepts the registration and asks: "Please enter your Date of Birth to verify your identity."

The Result: Sarah enters her DOB. The system converts her Stub to Active. Because John was linked to her in Scenario 3, John automatically appears in her portal under "My Family."

Scenario 6: The "Merge Clean-Up" (The Missing Scenario)
The Situation: A secretary created a Pure Stub for John (no email) on Monday. On Friday, they created a Pure Stub for John again (no email). Now John has two disconnected medical records.

Admin Action: The Clinic Manager opens your Merge Records Utility.

System Response: The Manager selects "John (Monday)" as the target and "John (Friday)" as the source.

The Result: The system moves Friday's appointment history into Monday's profile, then archives the Friday duplicate.


Here are Scenarios 7 through 10, fully updated and formatted so you can paste them directly into your master document right after Scenario 6.

Scenario 7: The "Nickname/Typo Catch" (Proactive Duplicate Prevention)
The Situation: A patient named Jonathan Smith is already in the database as a Pure Stub (DOB: 10/12/1990). Six months later, he walks in. A busy secretary doesn't search for him first and starts typing a new form using his nickname: "Jon Smith".
Admin Action: Secretary enters "Jon Smith", DOB "10/12/1990", and clicks to the next field.
System Response: The database’s fuzzy search triggers a Tier 3 Match (Exact DOB + Fuzzy Name). The form pauses, the screen dims, and a modal appears.
Admin UI Prompt: > ⚠️ Potential Existing Record Found:

1. Jonathan Smith (DOB: 10/12/1990 | Phone: ****-****-4589)

The Result: The secretary looks at the screen, asks the patient "Are you Jonathan?", and clicks [View & Book this Profile]. The form is safely discarded, and no duplicate is created.

Scenario 8: The "True Coincidence" (Safe Override)
The Situation: Two completely unrelated women named Maria Garcia visit your clinic. Maria #1 is already in the system (DOB: 05/10/1980). Maria #2 walks in as a new patient (DOB: 05/11/1980).
Admin Action: Secretary types "Maria Garcia", DOB "05/11/1980".
System Response: The fuzzy search triggers a Tier 2 Match (Similar First/Last Name, close DOB). The modal pops up showing Maria #1.
Admin UI Prompt: > ⚠️ Potential Existing Record Found:

1. Maria Garcia (DOB: 05/10/1980)

The Result: The secretary asks the patient, "Were you born on May 10th?" The patient replies, "No, May 11th. I've never been here before." The secretary clicks [Proceed & Create as New Patient]. Because there is no email conflict, the database safely creates Maria #2 as a new Pure Stub.

Scenario 9: The "Shared Phone Number" (The Admin Choice)
The Situation: An active patient, Sarah, has a family member walk into the clinic. This family member does not provide an email, but uses Sarah's exact phone number as their contact info.
Admin Action: The secretary types the family member's name, DOB, and Sarah's phone number.
System Response: The database triggers a Tier 1 Match (Absolute Match on Phone Number). It intercepts the form to prevent a blind duplicate.
Admin UI Prompt: > ⚠️ Phone Number in Use: > This phone number is registered to the active patient 'Sarah'. Would you like to add this patient as a dependent family member under Sarah's profile?

[Link as Dependent] | [Proceed & Create as New Patient]

The Result (Outcome A - The Minor): The patient is Leo, her 12-year-old son. The secretary clicks [Link as Dependent]. Leo is saved to the patient_profiles table, directly linked to Sarah’s account so she can manage his bookings.

The Result (Outcome B - The Independent Adult): The patient is Mark, her 22-year-old son who shares her phone plan. The secretary realizes Mark is an adult, ignores the dependency suggestion, and clicks [Proceed & Create as New Patient]. The system creates a brand new, isolated Standalone Stub for Mark in the main profiles table. The system does not force him into his mother's account.

Scenario 10: The "Dependent Promotion" (Aging Out)
The Situation: Leo (from Scenario 9A) turns 18. He visits the clinic and says, "I used to be under my mom's account (Sarah), but I want my own portal now. Here is my new email: leo@email.com."
Admin Action: The secretary opens Sarah’s profile, navigates to her "Family & Dependents" tab, clicks on Leo, and selects the [Promote to Independent Account] utility. The secretary enters leo@email.com.
System Response (The Database Transaction): 1. Creates a brand new Primary Profile (profiles table) for Leo.
2. Moves all of his past appointments and medical logs from his old patient_profiles ID to his new Primary ID.
3. Deletes his dependent link to Sarah.
4. Triggers the automated "Setup your Patient Portal" email to Leo.

The Result: Leo now has full autonomy over his account and lifetime medical history. Sarah can no longer see his appointments when she logs into her portal, protecting Leo's adult privacy.