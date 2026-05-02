"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import {
  requestPasswordResetAction,
  type ForgotPasswordState,
} from "./actions";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Wordmark className="text-[18px] mx-auto mb-6" />
          <span className="gold-rule">Recuperação de acesso</span>
          <h1 className="heading-display text-3xl mt-3">Esqueceu a senha?</h1>
          <p className="text-sm text-gray-mid mt-3 max-w-sm mx-auto">
            Informe o e-mail cadastrado e enviaremos um link para você
            redefinir sua senha.
          </p>
        </div>

        {state.ok ? (
          <div className="bg-white border border-ink/10 p-8 text-center space-y-4 shadow-soft">
            <MailCheck
              className="h-10 w-10 text-gold mx-auto"
              strokeWidth={1.2}
            />
            <p className="font-display text-xl">Verifique seu e-mail</p>
            <p className="text-sm text-gray-mid leading-relaxed">
              Se este e-mail estiver cadastrado, você receberá em instantes um
              link para criar uma nova senha. O link expira em 1 hora.
            </p>
          </div>
        ) : (
          <form
            action={formAction}
            className="space-y-6 bg-white border border-ink/10 p-8 shadow-soft"
          >
            <label className="block">
              <span className="label-tech">E-mail</span>
              <input
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
              />
            </label>

            {state.error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full"
            >
              <Send className="h-4 w-4" strokeWidth={1.5} />
              {pending ? "Enviando…" : "Enviar link de recuperação"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gray-mid hover:text-gold transition-colors duration-300 ease-premium"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.6} />
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
