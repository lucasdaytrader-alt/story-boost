import { getCategoriesWithPreview, getProductBySlug } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { CategoryTile } from "@/components/story-boost/CategoryTile";
import { BottomNav } from "@/components/story-boost/BottomNav";

export default async function CategoriasPage() {
  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategoriesWithPreview(product.id),
  ]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper">
      <Header userName={user.name} isAdmin={user.isAdmin} />

      <div className="px-4 pb-2 pt-3">
        <h1 className="font-display text-xl font-bold text-ink">Categorias</h1>
        <p className="text-sm text-muted">Explore packs organizados por nicho</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-28 pt-2">
        {categories.map((c) => (
          <CategoryTile key={c.id} category={c} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
