"use client";

import { useActionState, useRef } from "react";
import { createUserAction, type UserActionState } from "./actions";
import { CopyCredentialsButton } from "./CopyCredentialsButton";

export function NewUserForm() {
  const [state, formAction, pending] = useActionState<UserActionState, FormData>(
    createUserAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form
        ref={formRef}
        action={(formData) => {
          formAction(formData);
          formRef.current?.reset();
        }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          name="name"
          placeholder="Nome"
          required
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40"
        />
        <input
          name="password"
          type="text"
          placeholder="Senha (mín. 6 caracteres)"
          required
          minLength={6}
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40"
        />
        <input
          name="plan"
          placeholder="Plano (ex: Mensal)"
          required
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {state?.error && <p className="mt-3 text-sm text-flame">{state.error}</p>}

      {state?.success && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="text-sm">
            <p className="font-semibold text-green-700">Usuário criado com sucesso.</p>
            <p className="text-green-700/80">
              E-mail: {state.email} · Senha: {state.password}
            </p>
          </div>
          <CopyCredentialsButton email={state.email} password={state.password} />
        </div>
      )}
    </div>
  );
}
