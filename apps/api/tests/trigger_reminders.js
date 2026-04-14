import { supabaseAdmin } from '../src/config/supabase.js';
import { testSend24hReminder, testSend48hReminder, testSendGuestReminder } from '../src/utils/scheduled-tasks.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function runTestReminders() {
    try {
        // ── 1. Find Latest Patient Appointment ──
        console.log('🔍 Fetching latest PATIENT appointment...');
        const { data: patientAppt } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .not('patient_id', 'is', null)
            .eq('status', 'CONFIRMED')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (patientAppt) {
            console.log(`✅ Found Patient Appt: ${patientAppt.id}`);
            console.log('--- Triggering Patient 24h ---');
            console.log(await testSend24hReminder(patientAppt.id, 24));
            console.log('--- Triggering Patient 48h ---');
            console.log(await testSend24hReminder(patientAppt.id, 48));
        }

        // ── 2. Find Latest Guest Appointment ──
        console.log('\n🔍 Fetching latest GUEST appointment...');
        const { data: guestAppt } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .is('patient_id', null)
            .eq('status', 'CONFIRMED')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (guestAppt) {
            console.log(`✅ Found Guest Appt: ${guestAppt.id}`);
            console.log('--- Triggering Guest 24h ---');
            console.log(await testSendGuestReminder(guestAppt.id, 24));
            console.log('--- Triggering Guest 48h ---');
            console.log(await testSendGuestReminder(guestAppt.id, 48));
        }

        console.log('\n✨ All test reminders triggered! Check the pnpm dev console and your email.');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
    }
}


runTestReminders();
