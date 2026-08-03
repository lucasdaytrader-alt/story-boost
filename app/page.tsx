import {
  getAllPacks,
  getCatalogStats,
  getCategoriesWithPreview,
  getFeaturedPacks,
  getProductBySlug,
} from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { Hero } from "@/components/story-boost/Hero";
import { CategoryChips } from "@/components/story-boost/CategoryChips";
import { CategoryShowcase } from "@/components/story-boost/CategoryShowcase";
import { PackCarouselSection } from "@/components/story-boost/PackCarouselSection";
import { AllPacksGrid } from "@/components/story-boost/AllPacksGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";

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

  const [user, categories, stats, featuredPacks] = await Promise.all([
    getCurrentUser(),
    getCategoriesWithPreview(product.id),
    getCatalogStats(product.id),
    getFeaturedPacks(product.id),
  ]);

  const activeCategory = categories.find((c) => c.slug === categoria);

  const packs = await getAllPacks(product.id, {
    categoryId: activeCategory?.id,
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink">
      <Header userName={user.name} isAdmin={user.isAdmin} variant="dark" />

      <Hero packCount={stats.packCount} assetCount={stats.assetCount} />

      <CategoryChips categories={categories} activeSlug={activeCategory?.slug} variant="dark" />

      {!activeCategory && (
        <>
          <PackCarouselSection
            title="Em destaque"
            subtitle="✨ atualizado esta semana"
            packs={featuredPacks}
            variant="dark"
            size="lg"
          />
          <CategoryShowcase categories={categories} />
        </>
      )}

      <AllPacksGrid packs={packs} activeCategoryName={activeCategory?.name} />

      <BottomNav />
    </div>
  );
}
