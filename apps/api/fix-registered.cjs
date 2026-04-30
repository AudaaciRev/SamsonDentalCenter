const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixAllRegistered() {
  console.log('Targeting specific account and all existing primary profiles...');
  
  // 1. Specifically target your email
  const { error: specificErr } = await supabase
    .from('profiles')
    .update({ is_registered: true })
    .eq('email', 'picardochristopherjohnoleo1@gmail.com');
    
  if (specificErr) console.error('Error updating specific account:', specificErr);
  else console.log('Specific account updated.');

  // 2. Mark all accounts that have an email (assuming they are primary/registered)
  const { error: allErr } = await supabase
    .from('profiles')
    .update({ is_registered: true })
    .not('email', 'is', null);
    
  if (allErr) console.error('Error updating all accounts with emails:', allErr);
  else console.log('All accounts with emails marked as registered.');
}

fixAllRegistered();
