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
}: {
  pack: PackCardData;
  variant?: "carousel" | "grid";
  /** Usado no variant="grid" para variar a altura do card (ritmo tipo masonry). */
  index?: number;
  /** Usado no variant="carousel" — "lg" é o carrossel de destaque da Home. */
  size?: "md" | "lg";
}) {
  const wrapClasses =
    variant === "carousel"
      ? size === "lg"
        ? "w-[80vw] max-w-[340px] shrink-0"
        : "w-[19rem] shrink-0"
      : "w-full";
  const imageClasses =
    variant === "carousel" ? (size === "lg" ? "h-72" : "h-64") : GRID_ASPECTS[index % GRID_ASPECTS.length];

  const title = toTitleCase(pack.name);

  return (
    <Link
      href={`/pack/${pack.slug}`}
      className={`focus-ring-dark transition-premium hover-lift group block overflow-hidden rounded-3xl bg-card p-2 shadow-elevation-1 ring-1 ring-white/10 active:scale-[0.98] hover:shadow-glow-brand hover:ring-white/25 ${wrapClasses}`}
    >
      {/* Capa conceitual (ícone + gradiente por tema) — nunca a primeira
          figurinha do pack. O título oficial vai abaixo, fora da arte. */}
      <div className={`relative overflow-hidden rounded-2xl ${imageClasses}`}>
        <PackCoverArt name={pack.name} className="cover-zoom h-full w-full" />

        {pack.isPremium ? (
          <Badge variant="price" className="absolute right-2.5 top-2.5">
            R$ {(pack.priceCents! / 100).toFixed(2).replace(".", ",")}
          </Badge>
        ) : (
          <Badge variant="free" className="absolute right-2.5 top-2.5">
            Grátis
          </Badge>
        )}
      </div>

      <div className="px-1.5 pb-1.5 pt-3">
        <p
          className={[
            "font-display font-bold leading-tight text-white line-clamp-1",
            size === "lg" ? "text-[19px] font-extrabold" : "text-[16px]",
          ].join(" ")}
        >
          {title}
        </p>
        <p className={`mt-1 text-white/55 ${size === "lg" ? "text-[13px]" : "text-[12.5px]"}`}>
          {pack.assetCount} elementos{pack.categoryName ? ` · ${pack.categoryName}` : ""}
        </p>
      </div>
    </Link>
  );
}
