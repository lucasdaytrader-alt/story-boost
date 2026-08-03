import { getProductBySlug, searchCatalog } from "@/lib/boost-engine/services/content";
import { getCurrentUser } from "@/lib/boost-engine/services/users";
import { recordSearchEvent } from "@/lib/boost-engine/services/analytics";
import { Header } from "@/components/story-boost/Header";
import { SearchBar } from "@/components/story-boost/SearchBar";
import { PackCarouselSection } from "@/components/story-boost/PackCarouselSection";
import { ElementsGrid } from "@/components/story-boost/ElementsGrid";
import { BottomNav } from "@/components/story-boost/BottomNav";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

const SUGGESTIONS = ["cafeteria", "black friday", "fitness", "imóveis", "frases", "natal"];

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const user = await getCurrentUser();

  let results: Awaited<ReturnType<typeof searchCatalog>> | null = null;
  if (query) {
    results = await searchCatalog(product.id, query, user.id);
    const total = results.packs.length + results.elements.length;
    await recordSearchEvent({ productId: product.id, userId: user.id, query, resultCount: total });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper">
      <Header userName={user.name} isAdmin={user.isAdmin} />
      <SearchBar defaultValue={query} />

      {!query && (
        <div className="px-4 pb-28 pt-3">
          <SectionHeader title="Buscas populares" />
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Chip key={s} href={`/busca?q=${encodeURIComponent(s)}`}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {query && results && (
        <div className="pb-28">
          <p className="px-4 pb-2 pt-1 text-sm text-muted">
            <span className="font-semibold text-ink">{results.packs.length + results.elements.length}</span>{" "}
            resultados para &quot;{query}&quot;
          </p>

          {results.packs.length + results.elements.length === 0 ? (
            <div className="px-4">
              <EmptyState
                icon="🔍"
                title={`Nada encontrado para "${query}"`}
                message={`Tente: ${SUGGESTIONS.slice(0, 3).join(", ")}`}
              />
            </div>
          ) : (
            <>
              <PackCarouselSection title="Packs" packs={results.packs} />
              {results.elements.length > 0 && (
                <section className="px-4 pt-2">
                  <SectionHeader title="Elementos" />
                  <ElementsGrid elements={results.elements} />
                </section>
              )}
            </>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
