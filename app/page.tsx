import {
  getAllPacks,
  getCatalogStats,
  getCategoriesWithPreview,
  getFavoritedPacksForUser,
  getFeaturedPacks,
  getFreePacks,
  getMostUsedPacks,
  getNewPacks,
  getPremiumPacks,
  getProductBySlug,
  getRecommendedPacks,
} from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { Hero } from "@/components/story-boost/Hero";
import { CategoryChips } from "@/components/story-boost/CategoryChips";
import { CategoryShowcase } from "@/components/story-boost/CategoryShowcase";
import { PackCarouselSection } from "@/components/story-boost/PackCarouselSection";
import { AllPacksGrid } from "@/components/story-boost/AllPacksGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const product = await getProductBySlug("story-boost");
  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink p-8 text-center">
        <p className="text-white">
          Produto &quot;story-boost&quot; não encontrado. Rode{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">npm run db:seed</code>.
        </p>
      </main>
    );
  }

  const [user, categories, stats, featuredPacks, newPacks, premiumPacks, freePacks, mostUsedPacks] =
    await Promise.all([
      getCurrentUser(),
      getCategoriesWithPreview(product.id),
      getCatalogStats(product.id),
      getFeaturedPacks(product.id),
      getNewPacks(product.id),
      getPremiumPacks(product.id),
      getFreePacks(product.id),
      getMostUsedPacks(product.id),
    ]);

  // Depende do usuário resolvido acima — roda numa segunda leva.
  const favoritedPacks = await getFavoritedPacksForUser(user.id, product.id);
  const recommendedCategoryIds = [
    ...new Set(favoritedPacks.map((p) => p.categoryId).filter((id): id is string => Boolean(id))),
  ];
  const recommendedPacksRaw = await getRecommendedPacks(
    product.id,
    recommendedCategoryIds,
    favoritedPacks.map((p) => p.id)
  );
  // Sem sinal do usuário ainda (ninguém favoritado) — cai para "Novidades".
  const recommendedPacks = recommendedPacksRaw.length > 0 ? recommendedPacksRaw : newPacks;

  const activeCategory = categories.find((c) => c.slug === categoria);

  const packs = await getAllPacks(product.id, {
    categoryId: activeCategory?.id,
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <Header userName={user.name} isAdmin={user.isAdmin} variant="dark" />

      <Hero packCount={stats.packCount} assetCount={stats.assetCount} />

      <CategoryChips categories={categories} activeSlug={activeCategory?.slug} variant="dark" />

      {!activeCategory && (
        <>
          <PackCarouselSection title="🔥 Em alta" packs={featuredPacks} variant="dark" size="lg" />
          <PackCarouselSection title="⭐ Novidades" packs={newPacks} variant="dark" />
          <PackCarouselSection title="❤️ Favoritos" packs={favoritedPacks} variant="dark" />
          <PackCarouselSection title="💎 Premium" packs={premiumPacks} variant="dark" />
          <PackCarouselSection title="🆓 Gratuitos" packs={freePacks} variant="dark" />
          <PackCarouselSection title="📈 Mais utilizados" packs={mostUsedPacks} variant="dark" />
          <PackCarouselSection title="🎯 Recomendados para você" packs={recommendedPacks} variant="dark" />
          <CategoryShowcase categories={categories} />
        </>
      )}

      <AllPacksGrid packs={packs} activeCategoryName={activeCategory?.name} />

      <BottomNav />
    </div>
  );
}
