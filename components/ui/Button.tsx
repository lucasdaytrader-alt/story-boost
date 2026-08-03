import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "brand-gradient text-white shadow-elevation-1 hover:shadow-glow-brand",
  outline: "border border-line text-ink/80 hover:border-ink/20 hover:bg-mist",
  ghost: "text-ink/70 hover:bg-mist",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-xl px-4 py-2 text-[13px]",
  md: "rounded-xl px-5 py-3 text-[14px]",
  lg: "rounded-2xl px-6 py-4 text-[15px]",
};

const baseClasses =
  "focus-ring transition-premium inline-flex items-center justify-center gap-2 font-semibold active:scale-[0.98]";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps =
  | (BaseProps & { href: string; loading?: undefined } & Omit<
        React.ComponentProps<typeof Link>,
        "href" | "className" | "children"
      >)
  | (BaseProps & { href?: undefined; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
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

  const { loading, disabled, ...buttonRest } = rest as {
    loading?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      {...buttonRest}
      disabled={disabled || loading}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v3a7 7 0 0 1 7 7h3Z" />
    </svg>
  );
}
