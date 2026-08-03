# Story Boost — Design System

Especificação técnica do sistema visual, implementado em `app/globals.css`
(tokens) e `components/ui/*` (primitivos). Para tom de voz e posicionamento
de marca, ver `BRAND.md` — este documento é o companheiro técnico: como cada
decisão de marca vira token, componente e regra de uso.

Objetivo declarado desta sprint: qualquer tela do app deve parecer desenhada
pela mesma pessoa, no mesmo dia, com o mesmo cuidado — e transmitir "isso
vale mais do que estou pagando" no primeiro toque.

## Cores

| Token (`--color-*`) | Hex | Uso |
|---|---|---|
| `ink` | `#16121f` | texto principal |
| `paper` | `#ffffff` | fundo geral (MVP é somente light mode) |
| `card` | `#1c1730` | chrome escuro de cards premium (packs, categorias) |
| `mist` | `#f5f4f8` | fundo neutro / superfícies secundárias / skeleton |
| `line` | `#ebe9f0` | bordas discretas |
| `muted` | `#837e94` | texto secundário |
| `flame` | `#ff4361` | acento primário — CTAs, estados ativos, erro |
| `ultra` | `#7c3aed` | acento secundário — links de ação, profundidade |
| `sun` | `#ffb020` | preço, novidade, badge de destaque |

Uso de opacidade (`text-ink/60`, `bg-white/90`, `border-line`...) é o
mecanismo padrão para variações — evite criar tokens novos para tons
intermediários.

## Tipografia

Duas famílias, cada uma com um papel fixo — nunca misturar o papel:

- **`font-display`** (Plus Jakarta Sans, 700/800) — headlines, nomes de
  pack/categoria/elemento, títulos de seção. Peso e presença.
- **`font-sans`** (Inter, 400/500/600) — corpo, metadados, UI, formulários.

### Escala (o que já está em produção, formalizado)

| Papel | Tamanho | Peso/família | Onde |
|---|---|---|---|
| Display hero | 26–30px | display, 800 | Hero da Home, logo do login |
| Título de página | 20px (`text-xl`) | display, bold | H1 de Pack/Favoritos/Categorias |
| Título de seção | 17–19px | display, bold | `SectionHeader`, cards de destaque |
| Corpo | 14–15px | sans, 400–500 | texto padrão, inputs, botões |
| Metadado | 12–13px | sans, 400 | contagens, timestamps, legendas |
| Caption/badge | 10–11px | sans, 600 | badges, tags, labels de ícone |

Regra: nunca introduzir um tamanho fora dessa escala sem motivo — se algo
"quase serve", use o valor da escala mais próximo em vez de um novo
`text-[Npx]` isolado.

## Espaçamento

Base: escala padrão do Tailwind (múltiplos de 4px). Convenções fixas do
produto:

- **Gutter de página**: `px-4` (16px) — toda tela mobile usa essa margem lateral.
- **Ritmo entre seções**: `pt-6` ao iniciar uma nova seção na Home,
  `pb-2`/`pb-3` para o respiro interno antes do próximo bloco.
- **Cards**: padding interno `p-2` a `p-2.5` para o "chrome" ao redor da
  imagem (cards escuros), `p-4`/`p-5` para cards de conteúdo (login, acesso
  no perfil).
- **Grids de 2 colunas** (packs, categorias, elementos): `gap-3`.
- **Barra inferior fixa**: sempre reserva `pb-28` no conteúdo da página para
  não ficar coberto pelo `BottomNav`.

## Raio de borda

| Camada | Classe | Uso |
|---|---|---|
| Pílula | `rounded-full` | chips, badges, avatar, botões de ícone |
| Controle | `rounded-xl` (12px) | inputs, botões, chips de filtro |
| Card padrão | `rounded-2xl` (16px) | ElementCard, banners |
| Card premium | `rounded-3xl` (24px) | PackCard, CategoryTile, paywall, login card |

Nunca dois raios diferentes no mesmo nível de hierarquia visual — se um card
é `3xl`, o elemento visualmente equivalente na tela vizinha também é.

## Sombra (elevação)

Três níveis, como utilitários (`app/globals.css`) — substituem qualquer
`shadow-sm`/`shadow-lg` ad hoc:

- **`.shadow-elevation-1`** — repouso. Cards, inputs, avatares.
- **`.shadow-elevation-2`** — hover/destaque. Cards ao passar o mouse, modais leves.
- **`.shadow-elevation-3`** — flutuante. `BottomNav`, sheet do preview de elemento.
- **`.shadow-glow-brand`** — glow colorido (flame) para o CTA mais importante da tela.

## Movimento

- **`.transition-premium`** — easing com leve *overshoot* na saída
  (`cubic-bezier(0.22, 1, 0.36, 1)`), 220ms. Usado em todo hover/press.
- **Feedback de toque**: todo elemento tocável tem `active:scale-95` (ícones)
  ou `active:scale-[0.98]` (cards) — resposta tátil imediata, como
  Spotify/Notion.
- **`prefers-reduced-motion: reduce`** desliga shimmer e transições —
  acessibilidade não é opcional num produto "premium".

## Estados

- **Foco (teclado)**: `.focus-ring` (sobre fundo claro) / `.focus-ring-dark`
  (sobre `card`/`ink`) — anel de 2px em `flame`, sempre visível via
  `:focus-visible` (não polui o clique de mouse).
- **Hover**: nunca muda só a cor — cards sobem de elevação-1 para
  elevação-2; botões escurecem levemente o fundo (`hover:bg-mist`).
- **Disabled**: `opacity-60` + `cursor-not-allowed`, consistente em todos os
  botões via o primitivo `Button`.
- **Loading**: spinner inline (`Button`/`FormSubmitButton`) — nunca troca o
  layout do botão, só o conteúdo.
- **Empty**: `EmptyState` — ícone + título + mensagem, borda tracejada.
- **Skeleton**: `.skeleton` (shimmer) + `Skeleton`/`PackCardSkeleton`/
  `CategoryCardSkeleton`/`ElementCardSkeleton`/`HeaderSkeleton` em
  `components/ui/Skeleton.tsx` — prontos para uso, mas **não** conectados via
  `loading.tsx` de rota: em `npm run dev` (Turbopack, Next 16.2.12) isso
  causa um bug confirmado de conteúdo preso atrás de um Suspense boundary
  escondido (funciona normalmente em `next build && next start`). Ver
  memória do projeto / ROADMAP.md antes de reativar essa via.

## Botões

Primitivo único: `components/ui/Button.tsx` (+ `FormSubmitButton` para forms
com `useFormStatus`).

| Variante | Uso |
|---|---|
| `primary` | ação principal da tela (Entrar, Usar no Story, Desbloquear) |
| `outline` | ação secundária (Sair, Google/Apple, Cancelar) |
| `ghost` | ação terciária, baixa ênfase |

Tamanhos `sm`/`md`/`lg`. Nunca estilizar um `<button>` cru fora deste
primitivo — inclusive social login e formulários de admin devem migrar para
ele nas próximas sprints.

## Ícones circulares

Primitivo `components/ui/IconButton.tsx` — variantes `ghost` (Header),
`outline` (compartilhar/baixar), `solid` (sobre imagem, ex. favoritar),
`dark` (sobre superfície escura, ex. fechar preview). Tamanhos `sm`(32px)/
`md`(36px)/`lg`(44px) — antes cada botão de ícone tinha um tamanho
diferente; agora é sempre um destes três.

## Ícones de linha (SVG inline)

Todo ícone customizado (não-emoji) usa `stroke="currentColor" strokeWidth="1.8"`
— nunca `2` nem outro valor. Emoji continua reservado para momentos de
voz/marca (badges de novidade, estados vazios — ver `BRAND.md`), não para
chrome funcional da UI (ex.: o cadeado do paywall é SVG, não 🔒).

## Filete de marca

A faixa `<div className="h-[3px] w-full brand-gradient" />` aparece no topo
de **toda** tela, não só nas que usam `Header` — replicada manualmente no
topo de Login, do cabeçalho de Pack (`BackLink`) e do preview de Elemento.
É a assinatura visual mínima que garante que nenhuma tela "esqueça" a marca,
mesmo as que não usam o `Header` padrão.

## Bottom sheet

Superfícies que sobem de baixo (preview de elemento) levam um *grabber*
(`h-1 w-10 rounded-full bg-line`, centralizado) no topo do sheet — sinaliza
"isso é arrastável/dispensável" mesmo sem gesto implementado, reforçando a
sensação de app nativo.

## Badges

Primitivo `components/ui/Badge.tsx` — `price`, `free`, `new`, `outline`,
`solid-dark`. Substitui os `<span>` de preço/grátis/novo/categoria que
antes eram estilizados manualmente em cada card.

## Componentes de layout

- **`SectionHeader`** — título + subtítulo ou link de ação. Usado em todo
  bloco "Em destaque / Navegue por nicho / Todos os packs / Elementos".
- **`EmptyState`** — mesmo padrão visual para "nada aqui" em qualquer lista.
- **`Skeleton`, `PackCardSkeleton`, `CategoryCardSkeleton`,
  `ElementCardSkeleton`, `HeaderSkeleton`** — compõem os `loading.tsx`.

## Cards de conteúdo (packs e categorias)

Linguagem única: moldura escura (`bg-card`, `p-2`, `rounded-3xl`) com a
imagem inserida (`rounded-2xl`) e badge sobreposto. Título/metadado ficam
dentro da moldura escura (packs, texto abaixo da imagem) ou sobre a própria
imagem com gradiente (categorias, banner do pack). A regra: **a imagem é
sempre protagonista dentro de um cartão que parece objeto físico** (sombra,
profundidade), não uma foto solta na tela.

## O que ficou fora desta sprint (ver ROADMAP.md)

- Painel `/admin` não recebeu o mesmo tratamento — é ferramenta interna, não
  a experiência de primeira impressão do produto; entra na próxima sprint.
- Dark mode continua fora de escopo (decisão de produto vigente).
