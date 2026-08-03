import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/Button";

export function Hero({
  packCount,
  assetCount,
}: {
  packCount: number;
  assetCount: number;
}) {
  return (
    <section className="grain relative overflow-hidden pb-5 pt-5">
      {/* blooms — canvas escuro ganha profundidade com luz colorida, não com foto */}
      <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-flame/40 blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 top-4 h-80 w-80 rounded-full bg-ultra/40 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 top-56 h-56 w-56 rounded-full bg-sun/25 blur-[80px]" />

      <div className="relative px-4">
        <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/90">
          <span aria-hidden>✨</span> Packs novos toda semana
        </span>

        <h1 className="mt-4 max-w-[300px] font-display text-[36px] font-extrabold leading-[1.02] tracking-tight text-white">
          Pare de criar Stories <span className="brand-gradient-text">do zero</span>
        </h1>

        <p className="mt-3.5 max-w-[290px] text-[15px] leading-snug text-white/55">
          Mais de {assetCount}+ elementos prontos, organizados por nicho —
          escolhe, baixa e posta em segundos.
        </p>

        <div className="mt-5">
          <Button href="/categorias" variant="primary" size="md">
            Explorar packs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="relative mt-5">
        <SearchBar variant="dark" />
      </div>

      <div className="relative mt-3 flex items-center gap-2 px-4">
        <Stat value={`${packCount}+`} label="packs" dotClass="bg-flame" />
        <Stat value={`${assetCount}+`} label="elementos" dotClass="bg-sun" />
      </div>
    </section>
  );
}

function Stat({ value, label, dotClass }: { value: string; label: string; dotClass: string }) {
  return (
    <span className="glass-dark inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden />
      <span className="text-[13px] font-bold text-white">{value}</span>
      <span className="text-[12px] text-white/50">{label}</span>
    </span>
  );
}
