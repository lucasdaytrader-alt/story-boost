import { BrandStripe } from "./BrandStripe";

/** Bloco base de carregamento (shimmer). Componha para montar telas de loading.tsx. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden />;
}

/** Skeleton de um PackCard (carrossel ou grid) — espelha as proporções reais do componente
    (capa limpa + título/contagem abaixo). */
export function PackCardSkeleton({ variant = "grid" }: { variant?: "carousel" | "grid" }) {
  const wrap = variant === "carousel" ? "w-[19rem] shrink-0" : "w-full";
  const image = variant === "carousel" ? "h-64" : "aspect-[4/5] w-full";

  return (
    <div className={`overflow-hidden rounded-3xl bg-card p-2 ${wrap}`}>
      <Skeleton className={`rounded-2xl bg-white/10 ${image}`} />
      <div className="px-1.5 pb-1.5 pt-3">
        <Skeleton className="h-4 w-3/4 bg-white/10" />
        <Skeleton className="mt-2 h-3 w-1/2 bg-white/10" />
      </div>
    </div>
  );
}

/** Skeleton de um CategoryTile grande. */
export function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-card p-2">
      <Skeleton className="aspect-[4/5] rounded-2xl bg-white/10" />
    </div>
  );
}

/** Skeleton de um ElementCard (grid 2 colunas). */
export function ElementCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-white/10">
      <Skeleton className="aspect-[0.85] w-full rounded-none bg-white/10" />
      <div className="p-2">
        <Skeleton className="h-9 w-full rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

/** Skeleton do Header — mesma silhueta (logo + ícones), sem depender de dados de sessão.
    Espelha as duas variantes do Header real (claro/escuro). */
export function HeaderSkeleton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const dot = dark ? "bg-white/15" : "bg-mist";

  return (
    <div className={`sticky top-0 z-20 ${dark ? "glass-dark" : "bg-paper/90 backdrop-blur-md"}`}>
      {!dark && <BrandStripe />}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className={`h-7 w-7 rounded-lg ${dot}`} />
          <Skeleton className={`h-4 w-24 ${dot}`} />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className={`h-9 w-9 rounded-full ${dot}`} />
          <Skeleton className={`h-9 w-9 rounded-full ${dot}`} />
        </div>
      </div>
    </div>
  );
}
