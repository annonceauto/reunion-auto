import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// À utiliser UNIQUEMENT côté serveur (webhook Stripe). Ne jamais exposer
// la clé "service role" au navigateur.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
