import { PackCard } from "./PackCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Pack = React.ComponentProps<typeof PackCard>["pack"];

export function PackCarouselSection({
  title,
  subtitle,
  packs,
  variant = "light",
  size = "md",
}: {
  title: string;
  subtitle?: string;
  packs: Pack[];
  variant?: "light" | "dark";
  size?: "md" | "lg";
}) {
  if (packs.length === 0) return null;

  return (
    <section className="pb-2 pt-1">
      <div className="px-4">
        <SectionHeader variant={variant} title={title} subtitle={subtitle} />
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {packs.map((p) => (
          <PackCard key={p.id} pack={p} size={size} />
        ))}
      </div>
    </section>
  );
}
