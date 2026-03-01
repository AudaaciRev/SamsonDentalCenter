import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// supabaseAdmin = Backend-only operations (create users, bypass RLS)
// supabasePublic = User operations (login, signup, public data access)

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const supabasePublic = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export { supabaseAdmin, supabasePublic };
