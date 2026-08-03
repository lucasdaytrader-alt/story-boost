"use client";

import { useActionState, useEffect, useRef } from "react";
import { createElementsAction, type ElementActionState } from "../actions";

const inputClass =
  "rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-flame/40";

export function NewElementForm({ packSlug }: { packSlug: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ElementActionState, FormData>(
    createElementsAction,
    null
  );

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <input type="hidden" name="packSlug" value={packSlug} />

      <label className="flex flex-1 flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Nome (só se enviar 1 arquivo)</span>
        <input name="name" className={inputClass} />
      </label>

      <label className="flex flex-1 flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Tags (aplicadas a todos, separadas por vírgula)</span>
        <input name="tags" placeholder="cafeteria, manha" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        <span className="font-medium">Arquivo(s) PNG</span>
        <input type="file" name="files" accept="image/png" required multiple className={inputClass} />
      </label>

      <label className="flex items-center gap-2 whitespace-nowrap text-sm text-ink">
        <input type="checkbox" name="isNew" />
        Marcar como novo
      </label>

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar"}
      </button>

      {state?.error && <p className="w-full text-sm text-flame">{state.error}</p>}
      {state?.success && (
        <p className="w-full text-sm text-green-600">
          {state.count === 1 ? "1 elemento adicionado!" : `${state.count} elementos adicionados!`}
        </p>
      )}
      <p className="w-full text-[11px] text-muted">
        Dica: selecione vários arquivos PNG de uma vez para upload em lote — o nome de cada um é gerado a partir do nome do arquivo.
      </p>
    </form>
  );
}
