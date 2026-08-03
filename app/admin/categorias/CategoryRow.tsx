"use client";

import { useActionState, useState } from "react";
import { updateCategoryAction, deleteCategoryAction, type CategoryActionState } from "./actions";

type Category = { id: string; name: string; slug: string; packCount: number };

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [updateState, updateFormAction] = useActionState<CategoryActionState, FormData>(
    updateCategoryAction,
    null
  );
  const [deleteState, deleteFormAction] = useActionState<CategoryActionState, FormData>(
    deleteCategoryAction,
    null
  );

  if (editing) {
    return (
      <tr className="border-b border-line last:border-0 bg-mist">
        <td className="px-4 py-2.5" colSpan={3}>
          <form action={updateFormAction} className="flex items-center gap-2">
            <input type="hidden" name="categoryId" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              className="flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm"
            />
            <button type="submit" className="text-sm font-semibold text-flame">
              Salvar
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted">
              Cancelar
            </button>
          </form>
          {updateState?.error && <p className="mt-1 text-xs text-flame">{updateState.error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-2.5 text-ink">{category.name}</td>
      <td className="px-4 py-2.5 text-muted">{category.slug}</td>
      <td className="px-4 py-2.5 text-ink">{category.packCount}</td>
      <td className="px-4 py-2.5 text-right">
        <div className="flex justify-end gap-3">
          <button onClick={() => setEditing(true)} className="text-sm text-ink/70 hover:text-ink">
            Editar
          </button>
          {!confirmingDelete ? (
            <button onClick={() => setConfirmingDelete(true)} className="text-sm text-flame">
              Excluir
            </button>
          ) : (
            <form action={deleteFormAction} className="flex items-center gap-2">
              <input type="hidden" name="categoryId" value={category.id} />
              <span className="text-xs text-flame">Confirma?</span>
              <button type="submit" className="text-sm font-semibold text-flame">
                Sim
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="text-sm text-muted">
                Não
              </button>
            </form>
          )}
        </div>
        {deleteState?.error && <p className="mt-1 text-xs text-flame">{deleteState.error}</p>}
      </td>
    </tr>
  );
}
