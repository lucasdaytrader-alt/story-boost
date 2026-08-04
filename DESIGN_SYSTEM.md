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
| Controle | `rounded-xl` (12px) | inputs, botões, chips de filtro, badge do logo (Header/login) |
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
- **`.cover-zoom`** — zoom único (scale 1.06) da imagem de capa no hover do
  cartão pai (`.group`). Usado por `PackCard`, `CategoryTile` (modo padrão) e
  `ElementCard` — antes cada um tinha sua própria magnitude (103/105/125%).
- **`.hover-lift`** — sobe 3px (`translateY`) só em telas com mouse
  (`hover: hover` + `pointer: fine`), nunca gruda em toque. Aplicado junto
  com `.transition-premium` em todo cartão de catálogo.
- **`.card-enter`** — entrada em cascata (fade + leve subida, 420ms) dos itens
  de um `CatalogGrid`, com atraso por `--stagger-index` (máx. 12 passos de
  40ms, pra não acumular atraso em listas grandes).
- **`prefers-reduced-motion: reduce`** desliga shimmer, `cover-zoom`,
  `hover-lift` e `card-enter` — acessibilidade não é opcional num produto
  "premium".

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
  `components/ui/Skeleton.tsx` — conectados via `loading.tsx` em toda rota de
  conteúdo (`/`, `/categorias`, `/busca`, `/favoritos`, `/pack/[slug]`), então
  nenhuma tela fica em branco enquanto os dados carregam (todas são
  `force-dynamic`). `HeaderSkeleton` recebe `variant="light"|"dark"` espelhando
  o `Header` real.

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

`components/ui/BrandStripe.tsx` aparece no topo de **toda** tela, não só nas
que usam `Header` — também no topo de Login, do cabeçalho de Pack
(`BackLink`) e do preview de Elemento (antes era um `<div>` replicado
manualmente em cada um desses lugares). É a assinatura visual mínima que
garante que nenhuma tela "esqueça" a marca, mesmo as que não usam o `Header`
padrão.

## Bottom sheet

Superfícies que sobem de baixo (preview de elemento) levam um *grabber*
(`h-1 w-10 rounded-full bg-line`, centralizado) no topo do sheet — sinaliza
"isso é arrastável/dispensável" mesmo sem gesto implementado, reforçando a
sensação de app nativo.

## Badges

Primitivo `components/ui/Badge.tsx` — `price`, `free`, `new`, `outline`,
`solid-dark`. Substitui os `<span>` de preço/grátis/novo/categoria que
antes eram estilizados manualmente em cada card. As três variantes de
catálogo são deliberadamente inconfundíveis entre si:

| Variante | Estilo | Significa |
|---|---|---|
| `price` | sólido `sun` | pack premium — sinaliza valor |
| `free` | pill de vidro (`bg-white/15` + `backdrop-blur`) | grátis |
| `new` | sólido `ultra` | elemento novo no catálogo |

(Antes `price` e `new` usavam a mesma cor `sun` e eram indistinguíveis.)

## Componentes de layout

- **`SectionHeader`** — título + subtítulo ou link de ação. Usado em todo
  bloco "Em destaque / Navegue por nicho / Todos os packs / Elementos".
- **`PageHeading`** — título + subtítulo de página (Categorias, Favoritos) —
  antes copiado manualmente em cada `page.tsx`.
- **`BrandStripe`** — o filete de gradiente do topo (ver seção "Filete de
  marca" abaixo), agora um componente em vez de `<div>` replicado.
- **`CatalogGrid`** — grid único do catálogo (ver seção acima).
- **`EmptyState`** — mesmo padrão visual para "nada aqui" em qualquer lista.
- **`Skeleton`, `PackCardSkeleton`, `CategoryCardSkeleton`,
  `ElementCardSkeleton`, `HeaderSkeleton`** — compõem os `loading.tsx`.

## Cards de conteúdo (packs, categorias e elementos)

Linguagem única: moldura escura (`bg-card`, `p-2` ou `ring-1 ring-white/10`)
com a imagem inserida (`rounded-2xl`) e badge sobreposto. Título/metadado
ficam sobrepostos à própria imagem, ancorados embaixo, sobre `.cover-overlay`
(gradiente de 2 stops que garante contraste em qualquer foto) — nunca abaixo
da imagem como bloco de texto solto. A regra: **a imagem é sempre
protagonista dentro de um cartão que parece objeto físico** (sombra,
profundidade), não uma foto solta na tela.

`CategoryTile` tem duas variantes propositais, não uma deriva acidental:
**vivid** (duotone colorido + ícone, só na Home — momento editorial de
"gênero", como os tiles do Spotify) e **standard** (a mesma moldura escura de
`PackCard`, usada em `/categorias` e em qualquer listagem prática). Ambas
usam `.cover-overlay`/`.cover-zoom`/`.hover-lift`.

`ElementCard` (adesivo individual) segue a mesma moldura escura, um nível
abaixo na hierarquia de raio (`rounded-2xl`, não `rounded-3xl` — é um item
dentro de um pack, não uma coleção) e sem overlay de texto, já que a imagem
ali não carrega título sobreposto.

## Grid do catálogo e responsividade

Todo grid de 2 colunas (packs, categorias, elementos) usa o mesmo componente,
`components/story-boost/CatalogGrid.tsx` — substitui as 3 implementações
divergentes que existiam antes (`grid` vs `columns`, `gap-3` vs `gap-3.5`).
Cresce em colunas conforme a tela aumenta (`grid-cols-2` → `sm:3` → `lg:4` →
`xl:5`, ou o equivalente em `columns-*` no modo `masonry`), então o layout
não muda com 20, 200 ou 2.000 itens — só quanto cabe por linha. Cada item
entra com `.card-enter` (stagger automático via índice).

As páginas de biblioteca (`/`, `/categorias`, `/busca`, `/favoritos`,
`/pack/[slug]`) usam a mesma largura progressiva de shell:
`max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl` — em mobile continua a
mesma coluna única de sempre; em tablet/desktop o conteúdo ganha espaço em
vez de flutuar como uma coluna estreita no meio da tela. `BottomNav`
continua mobile-first (não há sidebar de desktop nesta sprint).

## O que ficou fora desta sprint (ver ROADMAP.md)

- Painel `/admin` não recebeu o mesmo tratamento — é ferramenta interna, não
  a experiência de primeira impressão do produto; entra na próxima sprint.
- Dark mode continua fora de escopo (decisão de produto vigente).
