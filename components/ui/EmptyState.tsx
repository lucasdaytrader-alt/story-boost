/** Estado vazio consistente (busca sem resultado, pack sem elementos, favoritos vazios...). */
export function EmptyState({
  icon,
  title,
  message,
  variant = "light",
  className = "",
}: {
  icon: string;
  title: string;
  message: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <div
      className={[
        "flex flex-col items-center gap-2 rounded-2xl border border-dashed py-16 text-center",
        dark ? "border-white/15 bg-white/5" : "border-line bg-mist/40",
        className,
      ].join(" ")}
    >
      <span className="text-2xl">{icon}</span>
      <p className={`font-display font-bold ${dark ? "text-white" : "text-ink"}`}>{title}</p>
      <p className={`max-w-[220px] text-sm ${dark ? "text-white/55" : "text-muted"}`}>{message}</p>
    </div>
  );
}
