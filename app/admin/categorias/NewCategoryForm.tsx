"use client";

import { useActionState } from "react";
import { createCategoryAction, type CategoryActionState } from "./actions";

export function NewCategoryForm() {
  const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(
    createCategoryAction,
    null
  );

  return (
    <form action={formAction} className="flex items-start gap-2">
      <div className="flex-1">
        <input
          name="name"
          placeholder="Nome da nova categoria (ex: Advocacia)"
          required
          className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40"
        />
        {state?.error && <p className="mt-1 text-xs text-flame">{state.error}</p>}
        {state?.success && <p className="mt-1 text-xs text-green-600">Categoria criada.</p>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}
