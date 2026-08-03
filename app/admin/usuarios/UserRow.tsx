"use client";

import { useActionState, useState } from "react";
import {
  updateUserAction,
  deleteUserAction,
  resetPasswordAction,
  type SimpleUserActionState,
  type UserActionState,
} from "./actions";
import { CopyCredentialsButton } from "./CopyCredentialsButton";

type User = {
  id: string;
  name: string;
  email: string;
  plan: string | null;
  createdAt: number;
};

export function UserRow({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [updateState, updateFormAction] = useActionState<SimpleUserActionState, FormData>(
    updateUserAction,
    null
  );
  const [deleteState, deleteFormAction] = useActionState<SimpleUserActionState, FormData>(
    deleteUserAction,
    null
  );
  const [resetState, resetFormAction, resetPending] = useActionState<UserActionState, FormData>(
    resetPasswordAction,
    null
  );

  const createdAt = new Date(user.createdAt).toLocaleDateString("pt-BR");

  if (editing) {
    return (
      <tr className="border-b border-line last:border-0 bg-mist">
        <td className="px-4 py-2.5" colSpan={5}>
          <form action={updateFormAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <input
              name="name"
              defaultValue={user.name}
              className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              name="email"
              type="email"
              defaultValue={user.email}
              className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              name="plan"
              defaultValue={user.plan ?? ""}
              className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm"
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
      <td className="px-4 py-2.5 text-ink">{user.name}</td>
      <td className="px-4 py-2.5 text-muted">{user.email}</td>
      <td className="px-4 py-2.5 text-ink">{user.plan || "—"}</td>
      <td className="px-4 py-2.5 text-muted">{createdAt}</td>
      <td className="px-4 py-2.5 text-right">
        <div className="flex flex-wrap justify-end gap-3">
          <button onClick={() => setEditing(true)} className="text-sm text-ink/70 hover:text-ink">
            Editar
          </button>
          <form action={resetFormAction}>
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" disabled={resetPending} className="text-sm text-ink/70 hover:text-ink">
              {resetPending ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>
          {!confirmingDelete ? (
            <button onClick={() => setConfirmingDelete(true)} className="text-sm text-flame">
              Excluir
            </button>
          ) : (
            <form action={deleteFormAction} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
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
        {resetState?.success && (
          <div className="mt-2 flex flex-wrap items-center justify-end gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <p className="text-xs text-green-700">
              Nova senha: {resetState.password}
            </p>
            <CopyCredentialsButton email={resetState.email} password={resetState.password} />
          </div>
        )}
        {resetState?.error && <p className="mt-1 text-xs text-flame">{resetState.error}</p>}
      </td>
    </tr>
  );
}
