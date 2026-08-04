import { PackCard } from "./PackCard";
import { CatalogGrid } from "./CatalogGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

type Pack = React.ComponentProps<typeof PackCard>["pack"];

export function AllPacksGrid({
  packs,
  activeCategoryName,
  newPackIds,
}: {
  packs: Pack[];
  activeCategoryName?: string;
  /** IDs em destaque no carrossel de Novidades — aqui, fora dali, o selo "novo" ainda diz algo novo. */
  newPackIds?: Set<string>;
}) {
  return (
    <section className="px-4 pb-32 pt-10">
      <SectionHeader
        variant="dark"
        title={activeCategoryName ? activeCategoryName : "Biblioteca completa"}
        subtitle={`${packs.length} ${packs.length === 1 ? "pack" : "packs"}`}
      />

      {packs.length === 0 ? (
        <EmptyState
          variant="dark"
          icon="📦"
          title="Nenhum pack neste nicho ainda"
          message="Novos packs chegam toda semana — volte em breve."
        />
      ) : (
        <CatalogGrid
          variant="masonry"
          items={packs}
          keyFor={(p) => p.id}
          renderItem={(p, i) => (
            <PackCard pack={p} variant="grid" index={i} badge={newPackIds?.has(p.id) ? "new" : undefined} />
          )}
        />
      )}
    </section>
  );
}
