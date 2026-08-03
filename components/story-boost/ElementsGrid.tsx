import { ElementCard } from "./ElementCard";
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
    <div className="grid grid-cols-2 gap-3">
      {elements.map((el) => (
        <ElementCard key={el.id} element={el} packSlug={packSlug} />
      ))}
    </div>
  );
}
