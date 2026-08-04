import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPackAssets,
  getPackBySlug,
  getProductBySlug,
  getRelatedPacks,
  hasPackAccess,
  type PackAssetFilter,
} from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { PackFilterChips } from "@/components/story-boost/PackFilterChips";
import { ElementsGrid } from "@/components/story-boost/ElementsGrid";
import { PackCarouselSection } from "@/components/story-boost/PackCarouselSection";
import { PackPaywall } from "@/components/story-boost/PackPaywall";
import { BottomNav } from "@/components/story-boost/BottomNav";
import { Badge } from "@/components/ui/Badge";
import { BrandStripe } from "@/components/ui/BrandStripe";
import { timeAgo } from "@/lib/boost-engine/utils/time";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

function BackLink() {
  return (
    <div className="sticky top-0 z-20 bg-paper/90 backdrop-blur-md">
      <BrandStripe />
      <div className="flex items-center gap-2 px-2 py-2">
        <Link
          href="/"
          className="focus-ring transition-premium flex items-center gap-1.5 rounded-full px-2 py-1.5 text-ink/70 hover:bg-mist hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">Voltar</span>
        </Link>
      </div>
    </div>
  );
}

const VALID_FILTERS: PackAssetFilter[] = ["todos", "novos", "mais_usados", "favoritos"];

const EMPTY_STATE: Record<PackAssetFilter, { icon: string; title: string; message: string }> = {
  todos: { icon: "📦", title: "Pack vazio", message: "Ainda não há elementos aqui." },
  novos: { icon: "✨", title: "Nada novo por aqui", message: "Os elementos recentes deste pack aparecem aqui." },
  mais_usados: { icon: "🔥", title: "Ainda sem dados de uso", message: "Use elementos deste pack para vê-los aqui." },
  favoritos: { icon: "🤍", title: "Nenhum favorito neste pack", message: "Toque no coração de um elemento para salvá-lo aqui." },
};

export default async function PackDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { slug } = await params;
  const { filtro } = await searchParams;

  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const pack = await getPackBySlug(product.id, slug);
  if (!pack) notFound();

  const filter: PackAssetFilter = VALID_FILTERS.includes(filtro as PackAssetFilter)
    ? (filtro as PackAssetFilter)
    : "todos";

  const user = await getCurrentUser();

  const access = await hasPackAccess(user.id, pack);

  if (!access) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
        <BackLink />
        <div className="px-4 pb-1 pt-2">
          <h1 className="font-display text-xl font-bold text-ink">{pack.name}</h1>
          <p className="text-[13px] text-muted">{pack.assetCount} elementos · {pack.categoryName}</p>
        </div>
        <PackPaywall
          packId={pack.id}
          packName={pack.name}
          priceCents={pack.priceCents!}
          coverUrl={pack.coverUrl}
        />
        <BottomNav />
      </div>
    );
  }

  const [elements, relatedPacks] = await Promise.all([
    getPackAssets(pack.id, { userId: user.id, filter }),
    getRelatedPacks(pack.id),
  ]);

  const empty = EMPTY_STATE[filter];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <BackLink />

      <div className="px-4 pb-3">
        <div className="shadow-elevation-2 relative mb-3.5 h-36 w-full overflow-hidden rounded-3xl">
          <img src={pack.coverUrl} alt={pack.name} className="h-full w-full object-cover" />
          <div className="cover-overlay absolute inset-0" />
          <div className="absolute right-3 top-3 flex gap-2">
            {pack.isPremium ? (
              <Badge variant="price">R$ {(pack.priceCents! / 100).toFixed(2).replace(".", ",")}</Badge>
            ) : (
              <Badge variant="free">Grátis</Badge>
            )}
          </div>
        </div>
        <h1 className="font-display text-xl font-bold text-ink">{pack.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
          <span>{pack.assetCount} elementos</span>
          <span>·</span>
          <span>{timeAgo(pack.updatedAt)}</span>
          {pack.categoryName && (
            <>
              <span>·</span>
              <span>{pack.categoryName}</span>
            </>
          )}
        </div>
      </div>

      <PackFilterChips packSlug={pack.slug} active={filter} />

      <section className="px-4 pb-8">
        <ElementsGrid
          elements={elements}
          packSlug={pack.slug}
          emptyIcon={empty.icon}
          emptyTitle={empty.title}
          emptyMessage={empty.message}
        />
      </section>

      <div className="pb-28">
        <PackCarouselSection title="Você também vai gostar de" packs={relatedPacks} />
      </div>

      <BottomNav />
    </div>
  );
}
