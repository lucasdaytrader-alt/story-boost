import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PackCoverArt } from "./PackCoverArt";
import { toTitleCase } from "@/lib/boost-engine/utils/text";

type PackCardData = {
  id: string;
  slug: string;
  name: string;
  coverUrl: string;
  isPremium: boolean;
  priceCents: number | null;
  categoryName: string | null;
  assetCount: number;
};

const GRID_ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[5/6]", "aspect-[3/4]"];

export function PackCard({
  pack,
  variant = "carousel",
  index = 0,
  size = "md",
  badge,
}: {
  pack: PackCardData;
  variant?: "carousel" | "grid";
  /** Usado no variant="grid" para variar a altura do card (ritmo tipo masonry). */
  index?: number;
  /** Usado no variant="carousel" — "lg" é o carrossel de destaque da Home. */
  size?: "md" | "lg";
  /** Selo contextual opcional definido pela seção (ex.: "novo" em Novidades). */
  badge?: "new";
}) {
  const wrapClasses =
    variant === "carousel"
      ? size === "lg"
        ? "w-[80vw] max-w-[340px] shrink-0 h-72"
        : "w-[19rem] shrink-0 h-64"
      : `w-full ${GRID_ASPECTS[index % GRID_ASPECTS.length]}`;

  const title = toTitleCase(pack.name);

  return (
    <Link
      href={`/pack/${pack.slug}`}
      className={`focus-ring-dark transition-premium hover-lift group relative block overflow-hidden rounded-3xl shadow-elevation-1 ring-1 ring-white/10 active:scale-[0.98] hover:shadow-glow-brand hover:ring-white/25 ${wrapClasses}`}
    >
      {/* Capa conceitual (ícone + gradiente por tema) — nunca a primeira
          figurinha do pack. Nome/contagem ficam sobrepostos, à la Netflix. */}
      <PackCoverArt name={pack.name} className="cover-zoom h-full w-full" />
      <div className="cover-overlay absolute inset-0" />

      {badge === "new" && (
        <Badge variant="new" className="pointer-events-none absolute left-2.5 top-2.5">
          novo
        </Badge>
      )}

      {pack.isPremium ? (
        <Badge variant="price" className="pointer-events-none absolute right-2.5 top-2.5">
          R$ {(pack.priceCents! / 100).toFixed(2).replace(".", ",")}
        </Badge>
      ) : (
        <Badge variant="free" className="pointer-events-none absolute right-2.5 top-2.5">
          Grátis
        </Badge>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p
          className={[
            "font-display font-bold leading-tight text-white line-clamp-1 drop-shadow-sm",
            size === "lg" ? "text-[19px] font-extrabold" : "text-[16px]",
          ].join(" ")}
        >
          {title}
        </p>
        <p className={`mt-1 text-white/80 ${size === "lg" ? "text-[13px]" : "text-[12.5px]"}`}>
          {pack.assetCount} elementos{pack.categoryName ? ` · ${pack.categoryName}` : ""}
        </p>
      </div>
    </Link>
  );
}
