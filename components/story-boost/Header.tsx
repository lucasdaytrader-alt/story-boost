import Link from "next/link";
import { IconButton } from "@/components/ui/IconButton";
import { BrandStripe } from "@/components/ui/BrandStripe";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function Header({
  userName,
  isAdmin,
  variant = "light",
}: {
  userName: string;
  isAdmin?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <header className={`sticky top-0 z-20 ${dark ? "glass-dark" : "bg-paper/90 backdrop-blur-md"}`}>
      {!dark && <BrandStripe />}
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <span className="grid h-7 w-7 place-items-center rounded-xl brand-gradient text-xs font-bold text-white shadow-elevation-1">
            SB
          </span>
          <span className={`font-display text-[17px] font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
            Story Boost
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {isAdmin && (
            <IconButton href="/admin" variant={dark ? "dark" : "ghost"} aria-label="Painel administrativo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 21v-6M4 10V3M12 21v-9M12 8V3M20 21v-4M20 13V3" strokeLinecap="round" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="12" cy="10" r="2" />
                <circle cx="20" cy="15" r="2" />
              </svg>
            </IconButton>
          )}
          <IconButton variant={dark ? "dark" : "ghost"} aria-label="Notificações">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <Link
            href="/perfil"
            aria-label="Perfil"
            className={[
              "focus-ring transition-premium grid h-9 w-9 place-items-center rounded-full text-xs font-semibold active:scale-90",
              dark ? "bg-white text-ink" : "bg-ink text-white",
            ].join(" ")}
          >
            {initials(userName)}
          </Link>
        </div>
      </div>
    </header>
  );
}
