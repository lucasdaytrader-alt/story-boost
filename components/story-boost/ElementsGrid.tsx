import { ElementCard } from "./ElementCard";
import { CatalogGrid } from "./CatalogGrid";
import { EmptyState } from "@/components/ui/EmptyState";

type Element = React.ComponentProps<typeof ElementCard>["element"];

export function ElementsGrid({
  elements,
  packSlug,
  emptyIcon = "🔍",
  emptyTitle = "Nada por aqui ainda",
  emptyMessage = "Volte em breve — novos elementos chegam toda semana.",
}: {
  elements: Element[];
  packSlug?: string;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (elements.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <CatalogGrid
      items={elements}
      keyFor={(el) => el.id}
      renderItem={(el) => <ElementCard element={el} packSlug={packSlug} />}
    />
  );
}
