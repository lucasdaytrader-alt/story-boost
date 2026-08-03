# Story Boost — Product

## O que é

Story Boost é um app mobile-first de **packs de adesivos PNG profissionais para
Stories do Instagram**. O usuário navega por nicho/categoria, encontra um pack
pronto (gratuito ou premium), abre os elementos individuais e usa direto no
Stories — sem precisar de Canva, Photoshop ou qualquer habilidade de design.

O **pack** é a unidade central de navegação do produto (não o elemento
individual, não a categoria). Um pack agrupa vários `digitalAssets` (hoje
sempre do tipo `sticker`) sob um tema coeso — ex.: "Bom dia" na categoria
"Motivacional", "Sextou" na categoria "Humor".

## Como o produto é montado (schema)

- **Product** — Story Boost é o primeiro produto registrado sobre o "Boost
  Engine" (a camada core reutilizável, ver `lib/boost-engine`). O schema é
  genérico (`DigitalAsset`, não "Sticker") para permitir novos produtos
  (templates, ícones, presets) sem remodelar o banco.
- **Category** — sempre vinculada a um Product; agrupa packs por nicho.
- **Pack** — agrupa `digitalAssets`; pode ser `isPremium` (com `priceCents`)
  ou gratuito; `isFeatured` marca curadoria manual para o carrossel de
  destaque da Home.
- **Entitlement** — controla acesso a packs premium. Hoje sempre `active` via
  `source: "stub"` (ADR-003: ainda não existe gateway de pagamento
  integrado — o "buraco" para plugar Apple/Google IAP ou um gateway já
  existe no schema).
- **Favorites**, **Devices** (limite de 2 dispositivos simultâneos),
  **AnalyticsEvents** (view/search/favorite/share/use_in_story) completam o
  core.

## Fluxos principais

1. **Home** → busca, categorias, packs em destaque, catálogo completo.
2. **Categoria** → filtra a Home por nicho (`/?categoria=slug`).
3. **Pack** (`/pack/[slug]`) → grid de elementos do pack, com paywall se
   premium e usuário sem entitlement.
4. **Elemento** (`/pack/[slug]/elemento/[assetId]`) → preview + "usar no
   Stories" + favoritar.
5. **Busca** (`/busca`) → busca full-text simples (LIKE) por pack e por
   elemento (nome, descrição, categoria, tags).
6. **Favoritos**, **Perfil**, **Admin** (CMS interno para cadastrar
   categorias, packs e elementos).

## Convenções de código relevantes

- Nenhuma página/rota faz query direta ao banco — tudo passa por
  `lib/boost-engine/services/*.ts`.
- UI do produto vive em `components/story-boost/*`; primitivos genéricos em
  `components/ui/*`.
- Layout mobile-first, contido em `max-w-md`, com `BottomNav` fixo.
