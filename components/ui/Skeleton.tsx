/** Bloco base de carregamento (shimmer). Componha para montar telas de loading.tsx. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden />;
}

/** Skeleton de um PackCard (carrossel ou grid) — espelha as proporções reais do componente. */
export function PackCardSkeleton({ variant = "grid" }: { variant?: "carousel" | "grid" }) {
  const wrap = variant === "carousel" ? "w-72 shrink-0" : "w-full";
  const image = variant === "carousel" ? "h-52" : "aspect-[4/5] w-full";

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
    <div className="overflow-hidden rounded-2xl border border-line bg-mist">
      <Skeleton className="aspect-[0.85] w-full rounded-none" />
      <div className="p-2">
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

/** Skeleton do Header — mesma silhueta (logo + ícones), sem depender de dados de sessão. */
export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-20 bg-paper/90 backdrop-blur-md">
      <div className="h-[3px] w-full brand-gradient" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-lg bg-mist" />
          <Skeleton className="h-4 w-24 bg-mist" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-9 w-9 rounded-full bg-mist" />
          <Skeleton className="h-9 w-9 rounded-full bg-mist" />
        </div>
      </div>
    </div>
  );
}
