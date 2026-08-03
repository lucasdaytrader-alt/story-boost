"use client";

import { useActionState, useEffect, useState } from "react";
import { updateElementAction, deleteElementAction, type ElementActionState } from "../actions";

type Element = {
  id: string;
  name: string;
  previewUrl: string;
  isNew: boolean;
  usageCount: number;
};

export function ElementAdminGrid({ elements }: { elements: Element[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {elements.map((el) => (
        <div key={el.id} className="overflow-hidden rounded-xl border border-line bg-paper">
          <img src={el.previewUrl} alt={el.name} className="aspect-square w-full object-cover" />
          <div className="p-2">
            <p className="truncate text-[11px] font-medium text-ink">{el.name}</p>
            <p className="text-[10px] text-muted">
              {el.isNew ? "novo · " : ""}
              {el.usageCount} usos
            </p>
            <button
              onClick={() => setEditingId(editingId === el.id ? null : el.id)}
              className="mt-1 text-[10px] font-semibold text-flame"
            >
              {editingId === el.id ? "Fechar" : "Editar"}
            </button>
          </div>

          {editingId === el.id && <ElementEditPanel element={el} onDone={() => setEditingId(null)} />}
        </div>
      ))}
    </div>
  );
}

function ElementEditPanel({ element, onDone }: { element: Element; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ElementActionState, FormData>(
    updateElementAction,
    null
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  return (
    <div className="border-t border-line bg-mist p-2">
      <form action={formAction} className="flex flex-col gap-1.5">
        <input type="hidden" name="assetId" value={element.id} />
        <input
          name="name"
          defaultValue={element.name}
          className="rounded-lg border border-line bg-white px-2 py-1 text-[11px]"
        />
        <input
          name="tags"
          placeholder="tags, separadas, por vírgula"
          className="rounded-lg border border-line bg-white px-2 py-1 text-[11px]"
        />
        <input type="file" name="file" accept="image/png" className="text-[10px]" />
        <label className="flex items-center gap-1 text-[10px] text-ink">
          <input type="checkbox" name="isNew" defaultChecked={element.isNew} />
          Novo
        </label>
        {state?.error && <p className="text-[10px] text-flame">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="brand-gradient rounded-lg py-1 text-[11px] font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </form>

      {!confirmingDelete ? (
        <button
          onClick={() => setConfirmingDelete(true)}
          className="mt-1.5 w-full rounded-lg border border-red-200 py-1 text-[11px] font-semibold text-red-600"
        >
          Excluir elemento
        </button>
      ) : (
        <form action={deleteElementAction} className="mt-1.5 flex flex-col gap-1">
          <input type="hidden" name="assetId" value={element.id} />
          <p className="text-[10px] text-red-600">Confirma exclusão?</p>
          <div className="flex gap-1">
            <button type="submit" className="flex-1 rounded-lg bg-red-600 py-1 text-[11px] font-semibold text-white">
              Sim
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="flex-1 rounded-lg border border-line py-1 text-[11px]"
            >
              Não
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
