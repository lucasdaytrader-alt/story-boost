import type { SVGProps } from "react";

/**
 * Capa conceitual de pack — ícone + gradiente exclusivo por tema, nunca uma
 * figurinha do pack. Substitui `pack.coverUrl` na apresentação (o campo
 * continua existindo no banco, só deixamos de renderizá-lo aqui).
 *
 * Sistema aprovado em revisão visual (redesign do sistema de capas):
 * - Gradiente sempre derivado dos tokens de marca (flame/ultra/sun/ink,
 *   nunca cor nova) — mas cada pack recebe uma variação de ângulo/paradas
 *   determinística (hash do nome), então dois packs do mesmo tema nunca
 *   renderizam a capa idêntica.
 * - 28 temas, cada um com ícone exclusivo (nenhum ícone é reaproveitado
 *   entre temas) cobrindo os nichos reais do catálogo.
 * - Monograma tipográfico gigante (inicial do nome, opacidade baixíssima,
 *   blend "overlay") sangra por um dos cantos — dá identidade extra mesmo
 *   quando dois packs caem no mesmo tema, à la capas de playlist.
 * - Brilho diagonal sutil (glass sheen) + vinheta mais profunda para reforçar
 *   a sensação de objeto físico/colecionável, não ícone plano de app.
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

function PercentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <circle cx="7.2" cy="7.2" r="2.6" />
      <circle cx="16.8" cy="16.8" r="2.6" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ScaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M12 3v16" />
      <path d="M7 20h10" />
      <path d="M4 8h6M14 8h6" />
      <path d="M4 8 1.6 12.8a2.6 2.6 0 0 0 4.8 0L4 8Z" />
      <path d="M20 8l-2.4 4.8a2.6 2.6 0 0 0 4.8 0L20 8Z" />
    </svg>
  );
}

function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M3 4h2.2l1 3M6.2 7h13l-1.8 7H8.6L6.2 7Z" />
      <circle cx="9.5" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5l-8 4H5a1 1 0 0 0-1 1Z" />
      <path d="M7 15v4a1 1 0 0 0 1 1h1v-5" />
      <path d="M18 9a4 4 0 0 1 0 6" />
    </svg>
  );
}

function FlaskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M10 3h4" />
      <path d="M11 3v6.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L13 9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M3 21 21 3" />
      <path d="M7 17l2 2M10 14l2 2M13 11l2 2M16 8l2 2" />
    </svg>
  );
}

function GemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M5 9 12 3l7 6-7 12L5 9Z" />
      <path d="M5 9h14" />
      <path d="M9 9 12 3l3 6" />
    </svg>
  );
}

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.6" />
      <path d="M8.5 7 10 4.5h4L15.5 7" />
    </svg>
  );
}

function NeedleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M4 20 17 7" />
      <ellipse cx="19" cy="5" rx="2.2" ry="1.5" transform="rotate(45 19 5)" />
      <path d="M6 14c1.5 1.5 3 1.5 4.5 0" />
    </svg>
  );
}

function DropletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M12 3c4 5 6.5 8.4 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 11.4 8 8 12 3Z" />
    </svg>
  );
}

function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M5 19c-1-6 1-12 14-15 1 10-3 14-14 15Z" />
      <path d="M6 18c3-4 6-7 12-13" />
    </svg>
  );
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="1.6" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v4M16 3.5v4" />
    </svg>
  );
}

function PulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...ICON_PROPS} {...props}>
      <path d="M3 12h4l2-6 4 12 2-9 2 3h4" />
    </svg>
  );
}

type CoverTheme = {
  /** 3 paradas de cor — sempre um blend de flame/ultra/sun/ink, nunca cor nova. */
  colors: [string, string, string];
  glow: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const THEMES = {
  vinhos: { colors: ["#2a0f1a", "#6b1f3a", "#ff4361"], glow: "#ff4361", Icon: WineIcon },
  fitness: { colors: ["#ff4361", "#ff7a3d", "#ffb020"], glow: "#ffb020", Icon: DumbbellIcon },
  negocios: { colors: ["#0f0c1c", "#2a1f4d", "#7c3aed"], glow: "#7c3aed", Icon: LaptopIcon },
  relacionamentos: { colors: ["#24102c", "#8a2a63", "#ff4361"], glow: "#ff4361", Icon: HeartIcon },
  viagens: { colors: ["#150f2c", "#4a3486", "#ffb020"], glow: "#ffb020", Icon: PlaneIcon },
  beleza: { colors: ["#2b1210", "#7a2e22", "#ffb020"], glow: "#ffb020", Icon: SparkleIcon },
  cafeteria: { colors: ["#1c1006", "#6b3f1d", "#ffb020"], glow: "#ffb020", Icon: CoffeeIcon },
  saudacoes: { colors: ["#1c1408", "#b3752f", "#ff8a3d"], glow: "#ffb020", Icon: SunriseIcon },
  datas: { colors: ["#1c0f14", "#b23a7a", "#7c3aed"], glow: "#ff4361", Icon: GiftIcon },
  frases: { colors: ["#150f24", "#4a1f52", "#ff4361"], glow: "#7c3aed", Icon: QuoteIcon },
  familia: { colors: ["#24120e", "#b3452f", "#ffb020"], glow: "#ff4361", Icon: RibbonIcon },
  geometrico: { colors: ["#100c19", "#4a3486", "#ffb020"], glow: "#7c3aed", Icon: ShapesIcon },
  imoveis: { colors: ["#150f24", "#3a2c62", "#ffb020"], glow: "#7c3aed", Icon: HouseIcon },
  promocoes: { colors: ["#20050c", "#7a1030", "#ff4361"], glow: "#ff4361", Icon: PercentIcon },
  advocacia: { colors: ["#0d0a18", "#2e2258", "#7c3aed"], glow: "#7c3aed", Icon: ScaleIcon },
  ecommerce: { colors: ["#1a1006", "#7a5518", "#ffb020"], glow: "#ffb020", Icon: CartIcon },
  notificacoes: { colors: ["#170c1c", "#5c2a52", "#b23a7a"], glow: "#ff4361", Icon: BellIcon },
  marketing: { colors: ["#2a0f14", "#8a2a4a", "#ff4361"], glow: "#ff4361", Icon: MegaphoneIcon },
  biomedica: { colors: ["#0c0c1c", "#26205c", "#7c3aed"], glow: "#7c3aed", Icon: FlaskIcon },
  arquitetura: { colors: ["#16121f", "#3a2c4d", "#ffb020"], glow: "#ffb020", Icon: RulerIcon },
  luxo: { colors: ["#1c0a10", "#8a3a2f", "#ffb020"], glow: "#ffb020", Icon: GemIcon },
  social: { colors: ["#150f24", "#4a2a63", "#7c3aed"], glow: "#7c3aed", Icon: CameraIcon },
  costura: { colors: ["#1c0f14", "#7a2a4a", "#ff4361"], glow: "#ff4361", Icon: NeedleIcon },
  bemestar: { colors: ["#0f0c1c", "#3a2c62", "#7c3aed"], glow: "#7c3aed", Icon: DropletIcon },
  agro: { colors: ["#1c1408", "#7a5518", "#ffb020"], glow: "#ffb020", Icon: LeafIcon },
  produtividade: { colors: ["#150f24", "#4a2a63", "#7c3aed"], glow: "#7c3aed", Icon: CalendarIcon },
  saude: { colors: ["#24100e", "#8a2a2f", "#ff4361"], glow: "#ff4361", Icon: PulseIcon },
  default: { colors: ["#16121f", "#ff4361", "#7c3aed"], glow: "#ff4361", Icon: StackIcon },
} satisfies Record<string, CoverTheme>;

/** Ordem importa — primeiro tema cujo termo aparece no nome vence. Temas mais
    específicos vêm antes de baldes genéricos para não perder o sinal. */
const THEME_KEYWORDS: [keyof typeof THEMES, string[]][] = [
  ["vinhos", ["vinho"]],
  ["fitness", ["treino", "fitness", "academia", "musculacao"]],
  ["cafeteria", ["cafe", "confeitaria", "doceria", "padaria"]],
  ["beleza", [
    "aesthetic", "estetica", "cilio", "lash", "makeup", "maquiagem",
    "micropigment", "nail", "manicure", "moda e beleza", "acessorio",
  ]],
  ["saudacoes", ["bom dia", "boa tarde", "boa noite", "tarde-noite"]],
  ["promocoes", ["promo", "black friday", "relampago"]],
  ["datas", ["natal", "ano novo", "new year", "carnaval", "aniversario", "janeiro", "meses", "dias da semana"]],
  ["frases", ["frase", "motivacao", "dicionario", "pergunta", "versiculo", "crista", "sorte"]],
  ["familia", ["maternidade", "mulher", "autismo", "consciencia negra"]],
  ["relacionamentos", ["namoro", "casamento", "casal", "relacionamento"]],
  ["viagens", ["viagem", "viagens", "turismo"]],
  ["imoveis", ["imovel", "imoveis", "corretor"]],
  ["advocacia", ["advocacia", "advogad"]],
  ["ecommerce", ["shoppe", "shopee", "magalu", "maquininha"]],
  ["notificacoes", ["notificaco"]],
  ["marketing", ["marketing"]],
  ["biomedica", ["biomedic"]],
  ["arquitetura", ["arquitet"]],
  ["negocios", ["empreended", "dinheiro", "money", "afiliad", "logista"]],
  ["costura", ["croche", "costureira"]],
  ["bemestar", ["doterra"]],
  ["agro", ["agro"]],
  ["produtividade", ["agenda"]],
  ["saude", ["nutricao", "emagrecimento"]],
  ["luxo", ["gold", "neon", "metallic", "glow", "rose gold"]],
  ["social", ["stories", "reacoes", "redes sociais", "polaroid", "escrita"]],
  ["geometrico", ["elementos", "minimalista", "circulo", "seta", "flecha", "diverso", "sombra"]],
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

/** Hash determinístico simples (djb2) — mesma capa sempre para o mesmo nome,
    mas cada pack "puxa" uma variação diferente de ângulo/monograma/posição. */
function hashString(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash);
}

const ANGLE_VARIANTS = [122, 138, 152, 168, 184, 205];
const STOP_VARIANTS = [
  [0, 46, 128],
  [0, 52, 138],
  [0, 40, 118],
  [6, 48, 132],
];

function buildGradient(colors: [string, string, string], seed: number) {
  const angle = ANGLE_VARIANTS[seed % ANGLE_VARIANTS.length];
  const stops = STOP_VARIANTS[Math.floor(seed / ANGLE_VARIANTS.length) % STOP_VARIANTS.length];
  return `linear-gradient(${angle}deg, ${colors[0]} ${stops[0]}%, ${colors[1]} ${stops[1]}%, ${colors[2]} ${stops[2]}%)`;
}

/** Cada variante é uma classe Tailwind escrita por extenso (não interpolada)
    para o JIT conseguir gerar o CSS — só escolhemos qual delas usar em runtime. */
const CLUSTER_POSITIONS = [
  "left-1/2 top-[42%]",
  "left-[44%] top-[50%]",
  "left-[56%] top-[44%]",
  "left-1/2 top-[52%]",
];

const MONOGRAM_POSITIONS = [
  "-left-[10cqmin] -top-[16cqmin]",
  "-right-[12cqmin] -top-[12cqmin]",
  "-left-[12cqmin] -bottom-[18cqmin]",
  "-right-[10cqmin] -bottom-[16cqmin]",
];

function monogramOf(packName: string) {
  const match = packName.match(/\p{L}/u);
  return match ? match[0].toUpperCase() : "•";
}

export function PackCoverArt({ name, className = "" }: { name: string; className?: string }) {
  const theme = resolveTheme(name);
  const seed = hashString(name);

  const gradient = buildGradient(theme.colors, seed);
  const cluster = CLUSTER_POSITIONS[seed % CLUSTER_POSITIONS.length];
  const monogramPos = MONOGRAM_POSITIONS[Math.floor(seed / CLUSTER_POSITIONS.length) % MONOGRAM_POSITIONS.length];
  const monogram = monogramOf(name);

  return (
    <div
      className={`relative isolate overflow-hidden [container-type:size] ${className}`}
      style={{ backgroundImage: gradient }}
    >
      <div className="grain pointer-events-none absolute inset-0" />

      {/* monograma tipográfico gigante, sangrando por um canto — identidade
          extra "à la capa de playlist" mesmo quando o tema se repete. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute select-none font-display text-[78cqmin] font-extrabold leading-none text-white/[0.14] [mix-blend-mode:overlay] ${monogramPos}`}
      >
        {monogram}
      </span>

      {/* glow + ícone se movem juntos como um único cluster por pack. */}
      <div
        className={`pointer-events-none absolute aspect-square w-[62cqmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-[34px] ${cluster}`}
        style={{ backgroundColor: theme.glow }}
      />
      <theme.Icon
        className={`absolute w-[62cqmin] -translate-x-1/2 -translate-y-1/2 text-white/95 [filter:drop-shadow(0_18px_30px_rgba(0,0,0,0.45))] ${cluster}`}
      />

      {/* brilho diagonal sutil — sensação de "objeto físico" sob luz, não
          ícone chapado. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] [mix-blend-mode:overlay]"
        style={{
          backgroundImage: "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.9) 48%, transparent 64%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 120% at 50% 12%, transparent 40%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}
