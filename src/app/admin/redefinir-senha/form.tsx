"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import {
  setNewPasswordAction,
  type ResetPasswordState,
} from "./actions";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    setNewPasswordAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 bg-white border border-ink/10 p-8 shadow-soft"
    >
      <label className="block">
        <span className="label-tech">Nova senha</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
        />
        <p className="text-[11px] text-gray-mid mt-1.5">
          Mínimo 8 caracteres.
        </p>
      </label>

      <label className="block">
        <span className="label-tech">Confirmar nova senha</span>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        <KeyRound className="h-4 w-4" strokeWidth={1.5} />
        {pending ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
