import Link from "next/link";
import { requireAdmin } from "@/lib/boost-engine/services/auth";

// Toda a área /admin/* é autenticada e consulta o banco por request — nunca
// deve ser prerenderizada estaticamente no build.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg brand-gradient text-xs font-bold text-white">
              SB
            </span>
            <span className="font-display text-[15px] font-bold text-ink">Boost Engine Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-ink">
              Ver app
            </Link>
            <span className="text-muted">{admin.name}</span>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 px-6 pb-2 text-sm">
          <Link href="/admin" className="rounded-lg px-3 py-1.5 text-ink/70 hover:bg-mist">
            Dashboard
          </Link>
          <Link href="/admin/categorias" className="rounded-lg px-3 py-1.5 text-ink/70 hover:bg-mist">
            Categorias
          </Link>
          <Link href="/admin/packs" className="rounded-lg px-3 py-1.5 text-ink/70 hover:bg-mist">
            Packs
          </Link>
          <Link href="/admin/usuarios" className="rounded-lg px-3 py-1.5 text-ink/70 hover:bg-mist">
            Usuários
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-6">{children}</main>
    </div>
  );
}
