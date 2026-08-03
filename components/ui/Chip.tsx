import Link from "next/link";
import { ReactNode } from "react";

export function Chip({
  href,
  active,
  variant = "light",
  children,
}: {
  href: string;
  active?: boolean;
  variant?: "light" | "dark";
  children: ReactNode;
}) {
  const inactiveClasses =
    variant === "dark"
      ? "border border-white/15 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
      : "border border-line text-ink/70 hover:border-ink/20 hover:bg-mist hover:text-ink";

  return (
    <Link
      href={href}
      className={[
        "focus-ring transition-premium shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium active:scale-95",
        active ? "brand-gradient text-white shadow-elevation-1" : inactiveClasses,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
