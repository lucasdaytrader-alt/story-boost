# Story Boost — Roadmap

Este roadmap reflete o que já está implementado (lido do código/schema) e os
"buracos" arquiteturais deixados de propósito para fases futuras. Não é uma
promessa de datas — é um mapa de onde a arquitetura já aponta.

## Feito

- Catálogo completo: Products → Categories → Packs → DigitalAssets, com busca
  full-text simples (LIKE) por pack e elemento.
- Auth por e-mail/senha ou social (`authProvider`), com limite de 2
  dispositivos simultâneos por conta (**Fase 2**).
- Favoritos, analytics de eventos (view/search/favorite/share/use_in_story).
- Entitlements funcionando via stub (`source: "stub"`) — todo cadastro novo
  já recebe acesso, e packs premium usam a mesma tabela que o gateway real
  vai preencher depois.
- Admin/CMS interno para cadastrar categorias, packs e elementos
  (`app/admin/*`).
- Curadoria manual de "Relacionados" e "Em destaque" (`packRelations`,
  `isFeatured`) — **Fase 4**.
- Reformulação visual da Home (versão híbrida: fundo claro, hero forte,
  cards escuros, categorias e packs grandes, tipografia premium) — em
  andamento, ver `PRODUCT.md`/`BRAND.md`.

## Próximo — buracos já preparados no schema

- **Gateway de pagamento real** (ADR-003/ADR-005): trocar
  `purchasePackAction` por integração real com Cakto/Stripe/Mercado Pago
  (ou IAP Apple/Google — `entitlements.source` já tem os valores
  `iap_apple`/`iap_google`/`gateway` reservados). É troca de função, não de
  arquitetura.
- **Curadoria automática de relacionados**: `packRelations.source` já aceita
  `tag_similarity`/`co_access`/`behavior` além de `manual` — falta o motor
  que popula isso.
- **Busca melhor que LIKE**: `searchCatalog` está marcada para eventualmente
  virar Postgres `tsvector`/`pg_trgm` ou um motor dedicado (Meilisearch/
  Typesense) sem mudar a assinatura da função, se o volume de catálogo
  crescer.

## Direção de produto (não bloqueada por schema)

- Expandir o Boost Engine para um segundo "Product" (templates, ícones ou
  presets) reaproveitando o mesmo core de `DigitalAsset` — hoje só Story
  Boost existe, mas o schema já foi desenhado para isso.
- Aprofundar a percepção de valor na Home (packs grandes, categorias em
  destaque, prova social/quantidade) antes de investir em mais canais de
  aquisição — a tese é que a conversão de quem já abriu o app importa mais,
  no momento, do que trazer mais gente pra ele.
