import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Privileged, SERVER-ONLY Supabase client using the service role key.
 * This bypasses RLS, so it is guarded by `import "server-only"` and must never
 * be imported into a Client Component. Use it only for trusted admin tasks
 * where the caller has already been verified as an authenticated admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase service role is not configured.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
