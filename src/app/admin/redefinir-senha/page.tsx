import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./form";
import { Wordmark } from "@/components/brand/wordmark";

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Sem sessão de recovery: o link não foi clicado ou já expirou.
    redirect(
      "/admin/login?error=" +
        encodeURIComponent(
          "Solicite um novo link de recuperação para definir sua senha.",
        ),
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Wordmark className="text-[18px] mx-auto mb-6" />
          <span className="gold-rule">Nova senha</span>
          <h1 className="heading-display text-3xl mt-3">Defina sua senha</h1>
          <p className="text-sm text-gray-mid mt-3">
            Conectado como <span className="text-ink">{user.email}</span>
          </p>
        </div>

        <ResetPasswordForm />

        <Link
          href="/admin/login"
          className="mt-6 block text-center text-[11px] uppercase tracking-[0.22em] text-gray-mid hover:text-gold transition-colors duration-300 ease-premium"
        >
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
