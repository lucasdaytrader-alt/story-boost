type Variant = "price" | "free" | "new" | "outline" | "solid-dark";

const variantClasses: Record<Variant, string> = {
  price: "bg-sun text-ink shadow-elevation-1",
  free: "bg-white text-ink shadow-elevation-1",
  new: "bg-sun text-ink shadow-elevation-1",
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
