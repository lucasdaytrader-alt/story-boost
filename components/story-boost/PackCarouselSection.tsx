import { PackCard } from "./PackCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Pack = React.ComponentProps<typeof PackCard>["pack"];

export function PackCarouselSection({
  title,
  subtitle,
  packs,
  variant = "light",
  size = "md",
  cardBadge,
}: {
  title: string;
  subtitle?: string;
  packs: Pack[];
  variant?: "light" | "dark";
  size?: "md" | "lg";
  /** Selo contextual aplicado a todos os cards da seção (ex.: "novo" em Novidades). */
  cardBadge?: "new";
}) {
  if (packs.length === 0) return null;

  return (
    <section className="py-5">
      <div className="px-4">
        <SectionHeader variant={variant} title={title} subtitle={subtitle} />
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-1">
        {packs.map((p) => (
          <PackCard key={p.id} pack={p} size={size} badge={cardBadge} />
        ))}
      </div>
    </section>
  );
}
