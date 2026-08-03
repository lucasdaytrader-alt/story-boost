import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import { digitalAssets, packAssets } from "@/lib/boost-engine/db/schema";
import { getCategoriesForProduct, getPackBySlug, getProductBySlug } from "@/lib/boost-engine/services/content";
import { NewElementForm } from "./NewElementForm";
import { EditPackForm } from "./EditPackForm";
import { ElementAdminGrid } from "./ElementAdminGrid";

export default async function AdminPackDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;

  const product = await getProductBySlug("story-boost");
  if (!product) return null;

  const pack = await getPackBySlug(product.id, slug);
  if (!pack) notFound();

  const categories = await getCategoriesForProduct(product.id);

  let elements = await db
    .select({
      id: digitalAssets.id,
      name: digitalAssets.name,
      previewUrl: digitalAssets.previewUrl,
      isNew: digitalAssets.isNew,
      usageCount: digitalAssets.usageCount,
    })
    .from(packAssets)
    .innerJoin(digitalAssets, eq(packAssets.assetId, digitalAssets.id))
    .where(eq(packAssets.packId, pack.id))
    .orderBy(packAssets.sortOrder);

  if (q) {
    const query = q.toLowerCase();
    elements = elements.filter((el) => el.name.toLowerCase().includes(query));
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <img src={pack.coverUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{pack.name}</h1>
          <p className="text-sm text-muted">
            {pack.assetCount} elementos · {pack.categoryName}
            {pack.isPremium && ` · Premium (R$ ${(pack.priceCents! / 100).toFixed(2).replace(".", ",")})`}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-line bg-paper p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">Adicionar elementos PNG (upload em lote)</h2>
        <NewElementForm packSlug={pack.slug} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Elementos deste pack</h2>
        <form method="get" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar elemento..."
            className="rounded-lg border border-line bg-paper px-3 py-1.5 text-[13px]"
          />
        </form>
      </div>

      <ElementAdminGrid elements={elements} />

      <div className="mt-10 border-t border-line pt-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Editar pack</h2>
        <EditPackForm pack={pack} categories={categories} />
      </div>
    </div>
  );
}
