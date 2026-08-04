import { getFavoritedAssets, getProductBySlug } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { Header } from "@/components/story-boost/Header";
import { ElementsGrid } from "@/components/story-boost/ElementsGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";
import { PageHeading } from "@/components/ui/PageHeading";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const user = await getCurrentUser();
  const elements = await getFavoritedAssets(user.id, product.id);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <Header userName={user.name} isAdmin={user.isAdmin} />

      <PageHeading
        title="Favoritos"
        subtitle={`${elements.length} ${elements.length === 1 ? "elemento salvo" : "elementos salvos"}`}
      />

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
