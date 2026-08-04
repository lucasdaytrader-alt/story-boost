import Link from "next/link";
import { categoryIcon } from "@/lib/boost-engine/utils/category-icon";

type CategoryPreview = {
  id: string;
  name: string;
  slug: string;
  coverUrl: string | null;
  packCount: number;
};

const VIVID_ACCENTS = [
  "bg-gradient-to-br from-flame to-ultra",
  "bg-gradient-to-br from-ultra to-sun",
  "bg-gradient-to-br from-sun to-flame",
  "bg-gradient-to-br from-ultra via-flame to-sun",
];

/**
 * `accentIndex` liga o modo "vivid" (duotone colorido, estilo tile de gênero
 * do Spotify) — usado só na Home. Sem ele, mantém o card escuro padrão
 * usado em /categorias.
 */
export function CategoryTile({
  category,
  accentIndex,
}: {
  category: CategoryPreview;
  accentIndex?: number;
}) {
  const vivid = accentIndex !== undefined;

  return (
    <Link
      href={`/?categoria=${category.slug}`}
      className={
        vivid
          ? "focus-ring-dark transition-premium hover-lift group relative block aspect-square overflow-hidden rounded-3xl ring-1 ring-white/10 active:scale-[0.97] hover:ring-white/20"
          : "focus-ring-dark transition-premium hover-lift group block overflow-hidden rounded-3xl bg-card p-2 shadow-elevation-1 active:scale-[0.98] hover:shadow-elevation-2"
      }
    >
      {vivid ? (
        <>
          {category.coverUrl ? (
            <img
              src={category.coverUrl}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-70 grayscale contrast-125 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.16]"
            />
          ) : (
            <div className="h-full w-full bg-card" />
          )}
          <div className={`absolute inset-0 mix-blend-color ${VIVID_ACCENTS[accentIndex % VIVID_ACCENTS.length]}`} />
          <div className="cover-overlay absolute inset-0" />
          <span className="glass-dark absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full text-[15px]">
            {categoryIcon(category.name)}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="font-display text-[16px] font-extrabold leading-tight text-white drop-shadow-sm">
              Coleção {category.name}
            </p>
            <p className="mt-0.5 text-[11.5px] font-medium text-white/80">
              {category.packCount} {category.packCount === 1 ? "pack" : "packs"}
            </p>
          </div>
        </>
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          {category.coverUrl ? (
            <img src={category.coverUrl} alt={category.name} className="cover-zoom h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-mist" />
          )}
          <div className="cover-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="font-display text-[16px] font-bold leading-tight text-white">Coleção {category.name}</p>
            <p className="mt-0.5 text-[12px] text-white/75">
              {category.packCount} {category.packCount === 1 ? "pack" : "packs"}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
