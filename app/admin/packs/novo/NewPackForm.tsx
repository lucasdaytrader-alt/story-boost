"use client";

import { useActionState, useState } from "react";
import { createPackAction, type PackActionState } from "../actions";

type Category = { id: string; name: string };

const inputClass =
  "rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40";

export function NewPackForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<PackActionState, FormData>(
    createPackAction,
    null
  );
  const [isPremium, setIsPremium] = useState(false);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <Field label="Nome do pack">
        <input name="name" required className={inputClass} />
      </Field>

      <Field label="Descrição">
        <textarea name="description" rows={2} className={inputClass} />
      </Field>

      <Field label="Categoria">
        <select name="categoryId" required className={inputClass}>
          <option value="">Selecione...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Imagem de capa">
        <input
          type="file"
          name="cover"
          accept="image/png,image/jpeg,image/webp"
          required
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isPremium"
          checked={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
        />
        Pack Premium (pago)
      </label>

      {isPremium && (
        <Field label="Preço (R$)">
          <input name="price" placeholder="9,90" className={inputClass} />
        </Field>
      )}

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isFeatured" />
        Destacar na Home
      </label>

      {state?.error && <p className="text-sm text-flame">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient mt-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar pack"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-ink">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
