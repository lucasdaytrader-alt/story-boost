import { getCategoriesWithPreview, getProductBySlug } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { CategoryTile } from "@/components/story-boost/CategoryTile";
import { CatalogGrid } from "@/components/story-boost/CatalogGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";
import { PageHeading } from "@/components/ui/PageHeading";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategoriesWithPreview(product.id),
  ]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <Header userName={user.name} isAdmin={user.isAdmin} />

      <PageHeading title="Categorias" subtitle="Explore packs organizados por nicho" />

      <div className="px-4 pb-28 pt-2">
        <CatalogGrid items={categories} keyFor={(c) => c.id} renderItem={(c) => <CategoryTile category={c} />} />
      </div>

      <BottomNav />
    </div>
  );
}
