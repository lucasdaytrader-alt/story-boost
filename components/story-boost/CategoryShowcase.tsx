import { CategoryTile } from "./CategoryTile";
import { CatalogGrid } from "./CatalogGrid";
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
      <CatalogGrid
        items={categories}
        keyFor={(c) => c.id}
        renderItem={(c, i) => <CategoryTile category={c} accentIndex={i} />}
      />
    </section>
  );
}
