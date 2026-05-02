import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string | null;
}

/**
 * Lê a sessão atual e verifica se o usuário está na tabela `admins`.
 * Retorna null quando não autenticado ou não é admin.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: admin.full_name,
  };
}

/**
 * Use no topo de páginas/actions admin. Redireciona para o login quando
 * o usuário não está autenticado ou não é admin.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
