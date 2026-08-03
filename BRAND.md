# Story Boost — Brand

## Tom de voz

Direto, energético, sem jargão de design. Fala como quem também usa
Instagram todo dia — não como um manual de produto. Prioriza benefício
("pronto pra usar", "em segundos") sobre feature ("catálogo organizado por
categoria"). Emoji pontual é aceitável quando reforça energia (✨), não como
decoração constante.

Exemplos já em produção (`components/story-boost/*`):

- "✨ atualizado esta semana" (subtítulo de carrossel)
- "Novos packs chegam toda semana — volte em breve." (estado vazio)
- "Adesivos profissionais para Stories do Instagram, prontos em segundos."
  (metadata da Home)

## Cores (`app/globals.css`, tokens `--sb-*`)

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#16121f` | texto principal, quase-preto com leve tom violeta |
| `paper` | `#ffffff` | fundo geral — **MVP é somente light mode** |
| `card` | `#1c1730` | fundo de cards escuros (elevação sobre `ink`) |
| `mist` | `#f5f4f8` | fundo neutro onde o adesivo é o protagonista |
| `line` | `#ebe9f0` | linhas/bordas discretas |
| `muted` | `#837e94` | texto secundário sobre fundo claro |
| `flame` | `#ff4361` | acento primário — energia |
| `ultra` | `#7c3aed` | acento secundário — profundidade |
| `sun` | `#ffb020` | destaque de novidade/atenção, badge de preço |

`.brand-gradient` / `.brand-gradient-text` = `linear-gradient(135deg, flame → ultra)`.
É a assinatura visual da marca (filete no topo do Header, CTAs ativos).

## Tipografia

- **Display** (`font-display`, Plus Jakarta Sans 700/800) — headlines, nomes
  de pack/categoria, qualquer texto que precise de peso e presença.
- **Sans** (`font-sans`, Inter 400/500/600) — corpo, metadados, UI.
- Ambas self-hosted via `@fontsource` (não `next/font/google` — bloqueado em
  ambiente sandbox; ver nota em `app/layout.tsx`).
- "Tipografia premium" na prática: tamanhos maiores e mais confiantes no
  hero/headline (display, peso 800), tracking apertado em títulos grandes,
  hierarquia clara entre display e sans — não trocar a família de fonte.

## Direção visual da Home (versão híbrida — Fase atual)

Decisão de design em vigor a partir desta reformulação:

- **Fundo geral claro** (`paper`/`mist`) — mantém a leveza e a legibilidade
  do catálogo, meta-decisão "MVP é somente light mode" continua valendo.
- **Hero forte**: headline grande em `font-display`, foco em benefício
  (velocidade, resultado profissional, zero esforço de design), não em
  feature. Fundo claro com wash sutil em gradiente da marca — não dark.
- **Cards escuros**: packs e categorias usam chrome escuro (`card`/`ink`)
  como moldura — a imagem fica protagonista dentro de um cartão premium,
  em vez de sangrar a página inteira. Contraste alto ajuda preço/CTA a se
  destacar.
- **Categorias e packs em destaque grandes**: menos itens por tela, mais
  presença por item — sinaliza curadoria, não volume genérico (o volume
  ainda é comunicado, mas via número explícito — "42 packs · 800+
  elementos" — não via densidade visual).
- **Percepção de valor**: badges de preço/"Grátis" sempre visíveis e
  legíveis sobre o card escuro; contagem de elementos por pack reforça que
  cada pack é "muita coisa pronta", não um único adesivo.
