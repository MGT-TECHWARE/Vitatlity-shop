import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Admin client — only use in admin components (bypasses RLS for storage uploads)
// persistSession: false ensures the service role key is always used instead of
// a stored user JWT, which would re-enable RLS and block storage uploads.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
