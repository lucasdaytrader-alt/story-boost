import { getCategoriesForProduct, getProductBySlug } from "@/lib/boost-engine/services/content";
import { NewPackForm } from "./NewPackForm";

export default async function NewPackPage() {
  const product = await getProductBySlug("story-boost");
  const categories = product ? await getCategoriesForProduct(product.id) : [];

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Novo pack</h1>
      <p className="mb-6 text-sm text-muted">Crie um novo pack de elementos para o catálogo.</p>
      <NewPackForm categories={categories} />
    </div>
  );
}
