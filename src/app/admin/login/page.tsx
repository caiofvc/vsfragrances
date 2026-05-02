import { CheckCircle2 } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { LoginForm } from "./form";

interface Props {
  searchParams: Promise<{ error?: string; reset?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, reset } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Wordmark className="text-[18px] mx-auto mb-6" />
          <span className="gold-rule">Painel administrativo</span>
          <h1 className="heading-display text-3xl mt-3">Acesso restrito</h1>
        </div>

        {reset === "ok" && (
          <div className="mb-6 flex items-start gap-3 bg-white border border-gold/30 px-4 py-3">
            <CheckCircle2
              className="h-5 w-5 text-gold flex-shrink-0 mt-0.5"
              strokeWidth={1.4}
            />
            <p className="text-sm text-ink">
              Senha redefinida com sucesso. Entre com a nova senha.
            </p>
          </div>
        )}

        <LoginForm initialError={error} />

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-gray-mid">
          Vasconcelos Fragrances · Painel
        </p>
      </div>
    </main>
  );
}
