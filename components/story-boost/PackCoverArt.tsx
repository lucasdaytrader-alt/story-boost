import type { SVGProps } from "react";

/**
 * Capa conceitual de pack — ícone + gradiente exclusivo por tema, nunca uma
 * figurinha do pack. Substitui `pack.coverUrl` na apresentação (o campo
 * continua existindo no banco, só deixamos de renderizá-lo aqui).
 *
 * Sistema aprovado em revisão visual: gradiente fixo por tema (sempre
 * derivado dos tokens de marca — flame/ultra/sun/ink, nunca cor nova),
 * ícone grande (~62% da capa), glow discreto atrás do ícone, vinheta +
 * grão pra profundidade de "objeto físico".
 */

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function WineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M7 3h10c0 4.5-1.8 7.3-4.2 8.4a1 1 0 0 0-.6.9V18" />
      <path d="M9.2 18h5.6" />
      <path d="M12 12.3V18" />
      <path d="M7.3 5.5h9.4" />
    </svg>
  );
}

function DumbbellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <rect x="5" y="9" width="2.4" height="6" rx="0.6" />
      <rect x="16.6" y="9" width="2.4" height="6" rx="0.6" />
      <path d="M7.4 12h9.2" />
      <rect x="2.4" y="10.4" width="1.4" height="3.2" rx="0.4" />
      <rect x="20.2" y="10.4" width="1.4" height="3.2" rx="0.4" />
    </svg>
  );
}

function LaptopIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <rect x="3.5" y="5.5" width="17" height="10.6" rx="1.2" />
      <path d="M8 9.6l2.6 2.6L15 8" />
      <path d="M2 18.5h20" />
      <path d="M4.2 18.5l1-2.4h13.6l1 2.4" />
    </svg>
  );
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M12 20s-7.4-4.6-9.7-9C.6 7.6 2.4 4 6 3.4a5.4 5.4 0 0 1 6 2.2 5.4 5.4 0 0 1 6-2.2c3.6.6 5.4 4.2 3.7 7.6C19.4 15.4 12 20 12 20Z" />
    </svg>
  );
}

function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M10.6 3.6 3 12l2.3 1 3-1.7 2.6 2.6-1.7 3 1 2.3 3-3.9 3.9 3.9.9-.9-2.4-5.7 3.6-3.6c1-1 1-2.4 0-3.3-1-1-2.4-1-3.3 0l-3.6 3.6-5.7-2.4Z" />
    </svg>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M12 3c.6 3.4 2 5.4 5 6-3 .6-4.4 2.6-5 6-.6-3.4-2-5.4-5-6 3-.6 4.4-2.6 5-6Z" />
      <path d="M19 15c.3 1.6.9 2.5 2.4 2.8-1.5.3-2.1 1.2-2.4 2.8-.3-1.6-.9-2.5-2.4-2.8 1.5-.3 2.1-1.2 2.4-2.8Z" />
    </svg>
  );
}

function CoffeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3.5c0 1-1 1-1 2s1 1 1 2" />
      <path d="M12 3.5c0 1-1 1-1 2s1 1 1 2" />
    </svg>
  );
}

function SunriseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M6.5 16a5.5 5.5 0 0 1 11 0" />
      <path d="M12 8V5" />
      <path d="M5.6 12l-1.8-1.8" />
      <path d="M18.4 12l1.8-1.8" />
      <path d="M2 19h20" />
      <path d="M4 16h16" />
    </svg>
  );
}

function GiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <rect x="4" y="9" width="16" height="11" rx="1.2" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9c-1.6 0-3-1-3-2.6A2.4 2.4 0 0 1 11.4 4c1.8 0 2.6 2.4 2.6 5" />
      <path d="M12 9c1.6 0 3-1 3-2.6A2.4 2.4 0 0 0 12.6 4c-1.8 0-2.6 2.4-2.6 5" />
    </svg>
  );
}

function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M7.2 8.4c-2 .6-3.2 2.3-3.2 4.4 0 2 1.4 3.4 3.1 3.4 1.6 0 2.9-1.2 2.9-2.9 0-1.5-1-2.6-2.4-2.8.2-1 1-1.8 2-2.1" />
      <path d="M16.2 8.4c-2 .6-3.2 2.3-3.2 4.4 0 2 1.4 3.4 3.1 3.4 1.6 0 2.9-1.2 2.9-2.9 0-1.5-1-2.6-2.4-2.8.2-1 1-1.8 2-2.1" />
    </svg>
  );
}

function RibbonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <circle cx="12" cy="7" r="3.4" />
      <path d="M9.8 9.8 7.5 20l4.5-2.6 4.5 2.6-2.3-10.2" />
    </svg>
  );
}

function ShapesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <circle cx="8" cy="8" r="4" />
      <rect x="13" y="4" width="7" height="7" rx="1.4" />
      <circle cx="16.5" cy="17" r="3.4" />
      <path d="M8.5 15 4 21h9L8.5 15Z" />
    </svg>
  );
}

function HouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function StackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <rect x="4" y="9" width="13" height="10" rx="1.6" />
      <path d="M8 9V6.4A1.4 1.4 0 0 1 9.4 5h9.2A1.4 1.4 0 0 1 20 6.4v9.2a1.4 1.4 0 0 1-1.4 1.4H17" />
    </svg>
  );
}

type CoverTheme = {
  gradient: string;
  glow: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const THEMES = {
  vinhos: { gradient: "linear-gradient(158deg, #2a0f1a 0%, #6b1f3a 48%, #ff4361 132%)", glow: "#ff4361", Icon: WineIcon },
  fitness: { gradient: "linear-gradient(158deg, #ff4361 0%, #ff7a3d 55%, #ffb020 132%)", glow: "#ffb020", Icon: DumbbellIcon },
  negocios: { gradient: "linear-gradient(158deg, #0f0c1c 0%, #2a1f4d 50%, #7c3aed 140%)", glow: "#7c3aed", Icon: LaptopIcon },
  relacionamentos: { gradient: "linear-gradient(158deg, #24102c 0%, #8a2a63 50%, #ff4361 140%)", glow: "#ff4361", Icon: HeartIcon },
  viagens: { gradient: "linear-gradient(158deg, #150f2c 0%, #4a3486 46%, #ffb020 140%)", glow: "#ffb020", Icon: PlaneIcon },
  beleza: { gradient: "linear-gradient(140deg, #2b1210 0%, #7a2e22 48%, #ffb020 135%)", glow: "#ffb020", Icon: SparkleIcon },
  cafeteria: { gradient: "linear-gradient(170deg, #1c1006 0%, #6b3f1d 50%, #ffb020 135%)", glow: "#ffb020", Icon: CoffeeIcon },
  saudacoes: { gradient: "linear-gradient(100deg, #1c1408 0%, #b3752f 55%, #ff8a3d 140%)", glow: "#ffb020", Icon: SunriseIcon },
  datas: { gradient: "linear-gradient(158deg, #1c0f14 0%, #b23a7a 50%, #7c3aed 135%)", glow: "#ff4361", Icon: GiftIcon },
  frases: { gradient: "linear-gradient(200deg, #150f24 0%, #4a1f52 50%, #ff4361 140%)", glow: "#7c3aed", Icon: QuoteIcon },
  familia: { gradient: "linear-gradient(110deg, #24120e 0%, #b3452f 50%, #ffb020 135%)", glow: "#ff4361", Icon: RibbonIcon },
  design: { gradient: "linear-gradient(158deg, #100c19 0%, #4a3486 50%, #ffb020 140%)", glow: "#7c3aed", Icon: ShapesIcon },
  imoveis: { gradient: "linear-gradient(140deg, #150f24 0%, #4a1f52 50%, #ff4361 140%)", glow: "#7c3aed", Icon: HouseIcon },
  default: { gradient: "linear-gradient(135deg, #16121f 0%, #ff4361 60%, #7c3aed 130%)", glow: "#ff4361", Icon: StackIcon },
} satisfies Record<string, CoverTheme>;

/** Ordem importa — primeiro tema cujo termo aparece no nome vence. */
const THEME_KEYWORDS: [keyof typeof THEMES, string[]][] = [
  ["vinhos", ["vinho"]],
  ["fitness", ["treino", "fitness", "academia", "musculacao"]],
  ["cafeteria", ["cafe", "confeitaria", "doceria", "padaria"]],
  ["beleza", [
    "aesthetic", "estetica", "cilio", "lash", "makeup", "maquiagem",
    "micropigment", "nail", "manicure", "moda e beleza", "acessorio",
  ]],
  ["saudacoes", ["bom dia", "boa tarde", "boa noite", "tarde-noite"]],
  ["datas", [
    "natal", "ano novo", "new year", "carnaval", "aniversario",
    "black friday", "promo", "relampago", "janeiro", "meses",
    "dias da semana",
  ]],
  ["frases", ["frase", "motivacao", "dicionario", "pergunta", "versiculo", "crista", "sorte"]],
  ["familia", ["maternidade", "mulher", "autismo", "consciencia negra"]],
  ["imoveis", ["imovel", "imoveis", "corretor"]],
  ["negocios", [
    "advocacia", "advogad", "empreended", "marketing", "dinheiro",
    "money", "afiliad", "logista", "magalu", "maquininha", "shoppe",
    "shopee", "notificaco", "biomedic", "arquitet",
  ]],
  ["design", [
    "elementos", "gold", "neon", "minimalista", "metallic", "glow",
    "sombra", "circulo", "seta", "flecha", "polaroid", "diverso",
    "stories", "reacoes", "redes sociais", "escrita",
  ]],
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function resolveTheme(packName: string): CoverTheme {
  const normalized = normalize(packName);
  for (const [themeId, keywords] of THEME_KEYWORDS) {
    if (keywords.some((k) => normalized.includes(k))) return THEMES[themeId];
  }
  return THEMES.default;
}

export function PackCoverArt({ name, className = "" }: { name: string; className?: string }) {
  const theme = resolveTheme(name);

  return (
    <div
      className={`relative isolate overflow-hidden [container-type:size] ${className}`}
      style={{ backgroundImage: theme.gradient }}
    >
      <div className="grain pointer-events-none absolute inset-0" />
      {/* dimensionado por cqmin (menor lado do contêiner) — mantém a mesma
          proporção tanto em capas de card (retrato) quanto em banners largos
          e baixos (detalhe do pack), sem estourar nem cortar o ícone. */}
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[62cqmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-[34px]"
        style={{ backgroundColor: theme.glow }}
      />
      <theme.Icon className="absolute left-1/2 top-[46%] w-[62cqmin] -translate-x-1/2 -translate-y-1/2 text-white/95 [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.35))]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 120% at 50% 12%, transparent 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
