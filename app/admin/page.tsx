import Link from "next/link";
import { getAdminOverview } from "@/lib/boost-engine/services/admin";
import { getProductBySlug } from "@/lib/boost-engine/services/content";

export default async function AdminDashboardPage() {
  const product = await getProductBySlug("story-boost");
  const stats = await getAdminOverview(product?.id ?? "");

  const cards = [
    { label: "Packs", value: stats.packCount },
    { label: "Categorias", value: stats.categoryCount },
    { label: "Elementos", value: stats.assetCount },
    { label: "Usuários", value: stats.userCount },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Visão geral do catálogo Story Boost.</p>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/packs/novo"
          className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Novo pack
        </Link>
        <Link
          href="/admin/categorias"
          className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Gerenciar categorias
        </Link>
      </div>
    </div>
  );
}
