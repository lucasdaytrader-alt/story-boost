import Link from "next/link";

type Size = "sm" | "md" | "lg";
type Variant = "ghost" | "outline" | "solid" | "dark";

const sizeClasses: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const variantClasses: Record<Variant, string> = {
  ghost: "text-ink/60 hover:bg-mist hover:text-ink",
  outline: "border border-line text-ink/70 hover:bg-mist",
  solid: "bg-white/90 text-ink/70 shadow-elevation-1 backdrop-blur-sm hover:bg-white",
  dark: "bg-white/10 text-white hover:bg-white/20",
};

type BaseProps = {
  size?: Size;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  "aria-label": string;
};

type IconButtonProps =
  | (BaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
  | (BaseProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">);

/** Botão circular de ícone — usado para ações secundárias (perfil, notificações, fechar, compartilhar, baixar). */
export function IconButton({
  size = "md",
  variant = "ghost",
  className = "",
  children,
  href,
  ...rest
}: IconButtonProps) {
  const classes = [
    "focus-ring transition-premium grid shrink-0 place-items-center rounded-full active:scale-90",
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
}
