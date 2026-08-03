import Link from "next/link";
import { getAllPacks, getProductBySlug } from "@/lib/boost-engine/services/content";

export default async function AdminPacksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const product = await getProductBySlug("story-boost");
  let packs = product ? await getAllPacks(product.id) : [];

  if (q) {
    const query = q.toLowerCase();
    packs = packs.filter(
      (p) => p.name.toLowerCase().includes(query) || p.categoryName?.toLowerCase().includes(query)
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Packs</h1>
          <p className="text-sm text-muted">{packs.length} packs {q && `(filtrado por "${q}")`}</p>
        </div>
        <Link
          href="/admin/packs/novo"
          className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Novo pack
        </Link>
      </div>

      <form method="get" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar pack por nome ou categoria..."
          className="w-full max-w-sm rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm"
        />
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-2.5 font-medium">Pack</th>
              <th className="px-4 py-2.5 font-medium">Categoria</th>
              <th className="px-4 py-2.5 font-medium">Elementos</th>
              <th className="px-4 py-2.5 font-medium">Acesso</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {packs.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="flex items-center gap-2 px-4 py-2.5 text-ink">
                  <img src={p.coverUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                  {p.name}
                </td>
                <td className="px-4 py-2.5 text-muted">{p.categoryName}</td>
                <td className="px-4 py-2.5 text-ink">{p.assetCount}</td>
                <td className="px-4 py-2.5">
                  {p.isPremium ? (
                    <span className="rounded-full bg-sun px-2 py-0.5 text-[11px] font-semibold text-ink">
                      Premium
                    </span>
                  ) : (
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink">
                      Grátis
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/admin/packs/${p.slug}`} className="text-flame hover:underline">
                    Gerenciar
                  </Link>
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Nenhum pack encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
