import { supabaseAdmin } from './apps/api/src/config/supabase.js';

async function probe() {
  const { error } = await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      type: 'PROBE',
      title: 'Probe',
      message: 'Probe Message',
      metadata: { date: '2026-04-16', service: 'Test' }
    });

  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('SUCCESS');
    await supabaseAdmin.from('notifications').delete().eq('type', 'PROBE');
  }
}

probe();
