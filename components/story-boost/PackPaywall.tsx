import { purchasePackAction } from "@/app/pack/actions";
import { PackCoverArt } from "./PackCoverArt";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";

export function PackPaywall({
  packId,
  packName,
  priceCents,
}: {
  packId: string;
  packName: string;
  priceCents: number;
}) {
  return (
    <div className="px-4 pb-10">
      <div className="shadow-elevation-2 relative overflow-hidden rounded-3xl">
        <PackCoverArt name={packName} className="h-60 w-full blur-md brightness-[0.55]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="shadow-elevation-1 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
            </svg>
          </span>
          <p className="font-display text-[19px] font-bold text-white">Pack Premium</p>
          <p className="max-w-[240px] text-[13px] leading-relaxed text-white/85">
            Desbloqueie {packName} e tenha acesso a todos os elementos deste pack para sempre.
          </p>
          <form action={purchasePackAction}>
            <input type="hidden" name="packId" value={packId} />
            <FormSubmitButton pendingLabel="Processando...">
              Desbloquear por R$ {(priceCents / 100).toFixed(2).replace(".", ",")}
            </FormSubmitButton>
          </form>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        Pagamento único · acesso vitalício a este pack
      </p>
    </div>
  );
}
