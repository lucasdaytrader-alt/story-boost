"use client";

import { useActionState, useState } from "react";
import { updatePackAction, deletePackAction, type PackActionState } from "../actions";

type Category = { id: string; name: string };
type Pack = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  isPremium: boolean;
  priceCents: number | null;
};

const inputClass =
  "rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40";

export function EditPackForm({ pack, categories }: { pack: Pack; categories: Category[] }) {
  const [state, formAction, pending] = useActionState<PackActionState, FormData>(
    updatePackAction,
    null
  );
  const [isPremium, setIsPremium] = useState(pack.isPremium);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <input type="hidden" name="packId" value={pack.id} />

        <label className="flex flex-col gap-1 text-sm text-ink">
          <span className="font-medium">Nome do pack</span>
          <input name="name" defaultValue={pack.name} required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink">
          <span className="font-medium">Descrição</span>
          <textarea name="description" defaultValue={pack.description ?? ""} rows={2} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink">
          <span className="font-medium">Categoria</span>
          <select name="categoryId" defaultValue={pack.categoryId ?? ""} required className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink">
          <span className="font-medium">Substituir imagem de capa (opcional)</span>
          <input type="file" name="cover" accept="image/png,image/jpeg,image/webp" className={inputClass} />
        </label>

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
          <label className="flex flex-col gap-1 text-sm text-ink">
            <span className="font-medium">Preço (R$)</span>
            <input
              name="price"
              defaultValue={pack.priceCents ? (pack.priceCents / 100).toFixed(2).replace(".", ",") : ""}
              className={inputClass}
            />
          </label>
        )}

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isFeatured" />
          Destacar na Home
        </label>

        {state?.error && <p className="text-sm text-flame">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-600">Alterações salvas.</p>}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient mt-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="mb-2 text-sm font-semibold text-red-700">Zona de risco</p>
        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
          >
            Excluir este pack
          </button>
        ) : (
          <form action={deletePackAction} className="flex items-center gap-3">
            <input type="hidden" name="packId" value={pack.id} />
            <p className="text-sm text-red-700">
              Isso apaga o pack e todos os seus elementos permanentemente. Confirma?
            </p>
            <button type="submit" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
              Sim, excluir
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-sm text-muted"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
