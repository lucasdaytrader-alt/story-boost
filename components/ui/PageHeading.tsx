/** Cabeçalho de título + subtítulo usado no topo das telas de listagem (Categorias, Favoritos). */
export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-4 pb-2 pt-3">
      <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}
