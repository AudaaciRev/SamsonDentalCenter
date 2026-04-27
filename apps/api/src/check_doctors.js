import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
    console.log('--- DENTISTS ---');
    const { data: dentists } = await supabase.from('dentists').select('id, tier, is_active');
    console.log(dentists);

    console.log('--- DENTIST SERVICES ---');
    const { data: ds } = await supabase.from('dentist_services').select('dentist_id, service_id');
    console.log(ds);
    
    console.log('--- SERVICE IDS ---');
    const { data: services } = await supabase.from('services').select('id, name');
    console.log(services);
}

check();
