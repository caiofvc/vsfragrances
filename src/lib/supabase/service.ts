import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a service-role key — NUNCA importar em código que
 * possa ir para o navegador. Usar apenas em Server Actions / Route Handlers
 * que já tenham validado que o usuário é admin.
 */
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
