import { Chip } from "@/components/ui/Chip";
import { categoryIcon } from "@/lib/boost-engine/utils/category-icon";

type Category = { id: string; name: string; slug: string };

export function CategoryChips({
  categories,
  activeSlug,
  variant = "light",
}: {
  categories: Category[];
  activeSlug?: string;
  variant?: "light" | "dark";
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
      <Chip href="/" active={!activeSlug} variant={variant}>
        Tudo
      </Chip>
      {categories.map((c) => (
        <Chip key={c.id} href={`/?categoria=${c.slug}`} active={activeSlug === c.slug} variant={variant}>
          <span aria-hidden>{categoryIcon(c.name)}</span> {c.name}
        </Chip>
      ))}
    </div>
  );
}
