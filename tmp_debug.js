import { findNextAvailableDate, getServiceAvailabilityStatus } from './apps/api/src/services/slot.service.js';
import { supabaseAdmin } from './apps/api/src/config/supabase.js';

async function run() {
    // 1. Get all services to test
    const { data: services } = await supabaseAdmin.from('services').select('id, name');
    console.log("Found services:", services.length);

    for (const s of services) {
        console.log(`\nTesting service: ${s.name} (${s.id})`);
        const status = await getServiceAvailabilityStatus(s.id);
        console.log("Status:", status);
        
        // Also check if any doctor specifically
        const { data: dentists } = await supabaseAdmin.from('dentist_services').select('dentist_id').eq('service_id', s.id);
        if (dentists && dentists.length > 0) {
            for (const d of dentists) {
                const docStatus = await getServiceAvailabilityStatus(s.id, d.dentist_id);
                console.log(`  Doctor ${d.dentist_id} Status:`, docStatus);
            }
        }
    }
    process.exit(0);
}

run();
