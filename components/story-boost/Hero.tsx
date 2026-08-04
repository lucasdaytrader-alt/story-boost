import Link from "next/link";
import { SearchBar } from "./SearchBar";

const SEARCH_EXAMPLES = ["Academia", "Promoção", "Vinhos", "Confeitaria", "Dentista", "Marketing"];

function getGreeting(hour: number) {
  if (hour >= 4 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function Hero({ userName }: { userName: string }) {
  const greeting = getGreeting(new Date().getHours());
  const firstName = userName.split(" ")[0];

  return (
    <section className="grain relative overflow-hidden pb-5 pt-8">
      {/* blooms — canvas escuro ganha profundidade com luz colorida, não com foto */}
      <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-flame/40 blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 top-4 h-80 w-80 rounded-full bg-ultra/40 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 top-56 h-56 w-56 rounded-full bg-sun/25 blur-[80px]" />

      <div className="relative px-4">
        <p className="text-[14px] font-medium text-white/50">
          {greeting}, {firstName}.
        </p>
        <h1 className="mt-1.5 font-display text-[30px] font-extrabold leading-[1.08] tracking-tight text-white">
          O que você quer criar hoje?
        </h1>
      </div>

      <div className="relative mt-6">
        <SearchBar variant="dark" size="lg" placeholder="Buscar por nicho, ocasião, estilo…" />
        <div className="no-scrollbar mt-3.5 flex items-center gap-2 overflow-x-auto px-4 text-[12.5px]">
          <span className="shrink-0 text-white/35">Sugestões</span>
          {SEARCH_EXAMPLES.map((example) => (
            <Link
              key={example}
              href={`/busca?q=${encodeURIComponent(example)}`}
              className="focus-ring-dark transition-premium shrink-0 whitespace-nowrap rounded font-medium text-white/55 before:mr-2 before:text-white/20 before:content-['·'] hover:text-white"
            >
              {example}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
