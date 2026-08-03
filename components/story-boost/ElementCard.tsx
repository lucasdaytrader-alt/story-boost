import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { UseInStoryButton } from "./UseInStoryButton";
import { Badge } from "@/components/ui/Badge";

type Element = {
  id: string;
  name: string;
  previewUrl: string;
  isNew: boolean;
  isFavorited: number;
  packSlug?: string;
};

export function ElementCard({
  element,
  packSlug,
}: {
  element: Element;
  /** Se informado, o toque na imagem abre a tela cheia dentro do contexto do pack. */
  packSlug?: string;
}) {
  const favorited = element.isFavorited > 0;
  const effectiveSlug = element.packSlug ?? packSlug;
  const previewHref = effectiveSlug ? `/pack/${effectiveSlug}/elemento/${element.id}` : undefined;

  return (
    <div className="transition-premium group relative overflow-hidden rounded-2xl border border-line bg-mist hover:border-ink/10 hover:shadow-elevation-2">
      {previewHref ? (
        <Link href={previewHref} className="focus-ring block aspect-[0.85] w-full">
          <img
            src={element.previewUrl}
            alt={element.name}
            className="transition-premium h-full w-full object-cover group-hover:scale-[1.03]"
          />
        </Link>
      ) : (
        <div className="aspect-[0.85] w-full">
          <img src={element.previewUrl} alt={element.name} className="h-full w-full object-cover" />
        </div>
      )}

      {element.isNew && (
        <Badge variant="new" className="pointer-events-none absolute left-2.5 top-2.5">
          novo
        </Badge>
      )}

      <FavoriteButton
        assetId={element.id}
        favorited={favorited}
        className="absolute right-2.5 top-2.5"
      />

      <div className="p-2">
        <UseInStoryButton assetId={element.id} assetName={element.name} imageUrl={element.previewUrl} />
      </div>
    </div>
  );
}
