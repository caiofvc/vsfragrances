"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, {
    ...initialState,
    error: initialError,
  });

  return (
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
          autoComplete="email"
          className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
        />
      </label>
      <label className="block">
        <span className="label-tech">Senha</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        <Lock className="h-4 w-4" strokeWidth={1.5} />
        {pending ? "Entrando…" : "Entrar"}
      </button>

      <div className="text-center pt-1">
        <Link
          href="/admin/recuperar-senha"
          className="text-[11px] uppercase tracking-[0.22em] text-gray-mid hover:text-gold transition-colors duration-300 ease-premium"
        >
          Esqueceu a senha?
        </Link>
      </div>
    </form>
  );
}
