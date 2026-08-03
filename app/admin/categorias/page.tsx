import { getCategoriesWithPreview, getProductBySlug } from "@/lib/boost-engine/services/content";
import { NewCategoryForm } from "./NewCategoryForm";
import { CategoryRow } from "./CategoryRow";

export default async function AdminCategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const product = await getProductBySlug("story-boost");
  let categories = product ? await getCategoriesWithPreview(product.id) : [];

  if (q) {
    const query = q.toLowerCase();
    categories = categories.filter((c) => c.name.toLowerCase().includes(query));
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Categorias</h1>
      <p className="mb-6 text-sm text-muted">Nichos usados para organizar os packs.</p>

      <div className="mb-6 rounded-2xl border border-line bg-paper p-4">
        <NewCategoryForm />
      </div>

      <form method="get" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar categoria..."
          className="w-full max-w-sm rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
        />
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-2.5 font-medium">Nome</th>
              <th className="px-4 py-2.5 font-medium">Slug</th>
              <th className="px-4 py-2.5 font-medium">Packs</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
