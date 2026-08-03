import { getFavoritedAssets, getProductBySlug } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { ElementsGrid } from "@/components/story-boost/ElementsGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";

export default async function FavoritosPage() {
  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const user = await getCurrentUser();
  const elements = await getFavoritedAssets(user.id, product.id);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper">
      <Header userName={user.name} isAdmin={user.isAdmin} />

      <div className="px-4 pb-2 pt-3">
        <h1 className="font-display text-xl font-bold text-ink">Favoritos</h1>
        <p className="text-sm text-muted">
          {elements.length} {elements.length === 1 ? "elemento salvo" : "elementos salvos"}
        </p>
      </div>

      <section className="px-4 pb-28 pt-2">
        <ElementsGrid
          elements={elements}
          emptyIcon="🤍"
          emptyTitle="Você ainda não favoritou nada"
          emptyMessage="Explore os packs e toque no coração para salvar aqui."
        />
      </section>

      <BottomNav />
    </div>
  );
}
