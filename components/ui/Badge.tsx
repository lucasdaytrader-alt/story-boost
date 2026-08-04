type Variant = "price" | "free" | "new" | "outline" | "solid-dark";

const variantClasses: Record<Variant, string> = {
  // Premium/preço — sólido em sun (dourado): sinaliza valor, sempre distinto de "novo".
  price: "bg-sun text-ink shadow-elevation-1",
  // Grátis — pill de vidro translúcida: legível sobre qualquer capa sem competir com o badge premium.
  free: "border border-white/30 bg-white/15 text-white shadow-elevation-1 backdrop-blur-md",
  // Novo — sólido em ultra (roxo): precisa ser inconfundível com o badge de preço/premium.
  new: "bg-ultra text-white shadow-elevation-1",
  outline: "border border-line text-ink/70",
  "solid-dark": "bg-ink/75 text-white backdrop-blur-sm",
};

/** Rótulo curto — preço, "grátis", "novo", categoria — usado de forma consistente em toda a UI. */
export function Badge({
  variant = "outline",
  className = "",
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
