# Story Boost — Vision

## Tese

Criadores de conteúdo, social media managers e pequenos negócios gastam tempo
demais desenhando Stories do zero — abrindo Canva, procurando fonte, ajustando
elemento por elemento — para um formato que dura 24 horas. Story Boost troca
esse trabalho por um catálogo de **adesivos PNG prontos, organizados por
nicho**, que qualquer pessoa consegue baixar e postar em segundos, sem saber
nada de design.

O produto não compete em "ferramenta de edição" (Canva, CapCut) — compete em
**velocidade e curadoria**: a promessa é abrir o app, achar o pack certo pro
momento (bom dia, sextou, promoção, data comemorativa) e já sair postando.

## Para quem

- Quem posta Stories com frequência e sente o adesivo "batido" do Instagram
  como amador — quer algo com cara de agência.
- Quem não tem tempo (ou paciência) para abrir uma ferramenta de design toda
  vez que precisa de um adesivo.
- Pequenos negócios e social media managers que precisam de volume
  consistente de conteúdo visual sem contratar um designer para cada peça.

## Como isso vira produto

- **O pack, não o elemento, é a unidade de valor.** É mais fácil vender e
  perceber valor em "o pack Sextou completo" do que em um sticker avulso —
  por isso o catálogo é sempre navegado por pack primeiro.
- **Curadoria por nicho > busca genérica.** Categorias são a forma principal
  de descoberta; a busca existe, mas o produto aposta que a maioria dos
  usuários vai navegar, não digitar.
- **Gratuito é a porta de entrada, premium é o approfundamento.** Todo
  usuário tem acesso ao catálogo gratuito; packs premium (com preço em
  `priceCents`) monetizam o catálogo mais desejado sem barrar a experiência
  básica.
- **O core é genérico de propósito.** O schema modela `DigitalAsset`, não
  "sticker" — a arquitetura já assume que packs de templates, ícones ou
  presets podem existir como outros "Products" sobre o mesmo Boost Engine,
  mesmo que Story Boost seja hoje o único produto ao vivo.

## O que "sucesso" parece, na experiência

- Alguém abre o app, entende em menos de 3 segundos que ali tem muito
  conteúdo pronto pra usar (percepção de abundância/valor — ver
  `getCatalogStats`), e sai com um adesivo postado antes de fechar o app.
- A Home comunica isso primeiro pelo hero (benefício, não feature) e depois
  reforça com prova (quantidade de packs/elementos, categorias grandes e
  visuais, packs em destaque com apresentação premium).
