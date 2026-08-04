import type { CSSProperties, ReactNode } from "react";

/**
 * Grid único para todo o catálogo (packs, categorias, elementos) — substitui
 * as 3 implementações divergentes que existiam antes (gap-3 vs gap-3.5,
 * `grid` vs `columns` para o mesmo efeito visual). Cresce em colunas conforme
 * a tela aumenta, então funciona igual com 20 ou 2.000 itens — só muda quanto
 * cabe por linha — e cada item entra com um fade+subida em cascata leve.
 */
export function CatalogGrid<T>({
  items,
  renderItem,
  keyFor,
  variant = "grid",
  className = "",
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyFor: (item: T, index: number) => string;
  /** "masonry" varia a altura dos itens (ritmo tipo Pinterest); "grid" mantém linhas alinhadas. */
  variant?: "grid" | "masonry";
  className?: string;
}) {
  const base =
    variant === "masonry"
      ? "columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className={[base, className].filter(Boolean).join(" ")}>
      {items.map((item, i) => (
        <div key={keyFor(item, i)} className="card-enter" style={{ "--stagger-index": i } as CSSProperties}>
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}
