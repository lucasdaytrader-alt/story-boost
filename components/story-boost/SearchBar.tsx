"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  defaultValue = "",
  variant = "light",
  className = "",
}: {
  defaultValue?: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const dark = variant === "dark";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
  }

  return (
    <form onSubmit={handleSubmit} className={className || "px-4 pb-3 pt-2"}>
      <div
        className={[
          "transition-premium flex items-center gap-2 rounded-2xl border px-4 py-3.5",
          dark
            ? "glass-dark border-white/10 focus-within:border-white/25 focus-within:ring-2 focus-within:ring-white/20"
            : "border-transparent bg-mist hover:border-line focus-within:border-transparent focus-within:bg-white focus-within:shadow-elevation-1 focus-within:ring-2 focus-within:ring-flame/40",
        ].join(" ")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`shrink-0 ${dark ? "text-white/50" : "text-muted"}`}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Buscar por nicho, evento, estilo..."
          className={[
            "w-full bg-transparent text-[15px] focus:outline-none",
            dark ? "text-white placeholder:text-white/40" : "text-ink placeholder:text-muted",
          ].join(" ")}
        />
      </div>
    </form>
  );
}
