import Link from "next/link";

/** Cabeçalho padrão de seção (título + subtítulo ou link de ação) — usado em toda seção da Home/Busca/Pack. */
export function SectionHeader({
  title,
  subtitle,
  action,
  variant = "light",
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <div className="flex items-baseline justify-between pb-3">
      <h2 className={`font-display text-[17px] font-bold ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {action ? (
        <Link
          href={action.href}
          className={[
            "focus-ring rounded-md text-[13px] font-semibold transition-colors",
            dark ? "text-white/70 hover:text-white" : "text-ultra hover:text-flame",
          ].join(" ")}
        >
          {action.label}
        </Link>
      ) : subtitle ? (
        <span className={`text-[13px] ${dark ? "text-white/50" : "text-muted"}`}>{subtitle}</span>
      ) : null}
    </div>
  );
}
