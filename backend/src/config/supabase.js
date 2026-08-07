const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

/**
 * Admin client — uses the SERVICE ROLE key, bypasses RLS.
 * Only ever used inside services/controllers on the backend, NEVER exposed
 * to the frontend.
 */
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Anon client — used for operations that should honor RLS as an
 * unauthenticated/public user (e.g. verifying a user's JWT).
 */
const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAdmin, supabaseAnon };
