import { CategoryTile } from "./CategoryTile";
import { SectionHeader } from "@/components/ui/SectionHeader";

type CategoryPreview = React.ComponentProps<typeof CategoryTile>["category"];

export function CategoryShowcase({ categories }: { categories: CategoryPreview[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="px-4 pb-2 pt-8">
      <SectionHeader
        variant="dark"
        title="Navegue por nicho"
        action={{ label: "Ver todas", href: "/categorias" }}
      />
      <div className="grid grid-cols-2 gap-3.5">
        {categories.map((c, i) => (
          <CategoryTile key={c.id} category={c} accentIndex={i} />
        ))}
      </div>
    </section>
  );
}
