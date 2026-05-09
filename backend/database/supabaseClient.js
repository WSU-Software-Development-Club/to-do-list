const { createClient } = require("@supabase/supabase-js");
const { env } = require("../config");

/**
 * Supabase clients use the same URL but different keys:
 *
 * Anon (public) key: requests respect Row Level Security. Use for user-scoped
 * work, e.g. validating a JWT with auth.getUser(token). Safe to expose in a
 * browser only if RLS policies are correct.
 *
 * Service role key: full access, bypasses RLS. Server-side only; never ship to
 * the frontend. Use only after you have verified the user or for trusted admin
 * operations.
 */

let client;
let serviceClient;

/** Anon key. RLS applies. */
function getSupabaseClient() {
  if (!client) {
    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    }
    client = createClient(url, key);
  }
  return client;
}

/** Service role key. Bypasses RLS. Server-only secret. */
function getSupabaseServiceClient() {
  if (!serviceClient) {
    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    serviceClient = createClient(url, key);
  }
  return serviceClient;
}

module.exports = { getSupabaseClient, getSupabaseServiceClient };
