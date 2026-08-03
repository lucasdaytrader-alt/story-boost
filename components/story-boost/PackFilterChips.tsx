import { Chip } from "@/components/ui/Chip";
import type { PackAssetFilter } from "@/lib/boost-engine/services/content";

const FILTERS: { value: PackAssetFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "novos", label: "Novos" },
  { value: "mais_usados", label: "Mais usados" },
  { value: "favoritos", label: "Favoritos" },
];

export function PackFilterChips({
  packSlug,
  active,
}: {
  packSlug: string;
  active: PackAssetFilter;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      {FILTERS.map((f) => (
        <Chip
          key={f.value}
          href={f.value === "todos" ? `/pack/${packSlug}` : `/pack/${packSlug}?filtro=${f.value}`}
          active={active === f.value}
        >
          {f.label}
        </Chip>
      ))}
    </div>
  );
}
