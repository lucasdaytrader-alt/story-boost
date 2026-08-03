"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/categorias", label: "Categorias", icon: GridIcon },
  { href: "/busca", label: "Buscar", icon: SearchIcon },
  { href: "/favoritos", label: "Favoritos", icon: HeartIcon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-dark shadow-elevation-3 fixed inset-x-5 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 mx-auto flex max-w-[400px] items-center justify-around rounded-full border-t-white/[0.14] px-2 py-2.5">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={[
              "focus-ring-dark transition-premium grid h-11 w-11 place-items-center rounded-full active:scale-90",
              active ? "brand-gradient shadow-glow-brand scale-105" : "hover:bg-white/10",
            ].join(" ")}
          >
            <Icon active={active} />
          </Link>
        );
      })}
    </nav>
  );
}

const INACTIVE = "rgba(255,255,255,0.55)";

function HomeIcon({ active }: { active?: boolean }) {
  if (active) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
        <path d="M3 11.5 12 4l9 7.5v7.5a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-7.5Z" />
      </svg>
    );
  }
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={INACTIVE} strokeWidth="1.8">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GridIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={active ? "#fff" : "none"}
      stroke={active ? "none" : INACTIVE}
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#fff" : INACTIVE}
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={active ? "#fff" : "none"}
      stroke={active ? "none" : INACTIVE}
      strokeWidth="1.8"
    >
      <path
        d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4a5 5 0 0 1 6.5 2 5 5 0 0 1 6.5-2c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={active ? "#fff" : "none"}
      stroke={active ? "none" : INACTIVE}
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}
