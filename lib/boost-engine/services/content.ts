/**
 * Boost Engine — Serviço de conteúdo
 *
 * Camada de acesso a dados reutilizável entre o app Story Boost e (no futuro)
 * o CMS Admin e outros produtos. As rotas/páginas nunca fazem query direta —
 * sempre passam por aqui.
 *
 * Reposicionamento de produto: Story Boost é uma plataforma de PACKS de
 * elementos PNG para Stories — o pack é a unidade central de navegação.
 */

import { and, desc, eq, inArray, like, notInArray, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import {
  assetTags,
  categories,
  digitalAssets,
  entitlements,
  favorites,
  packAssets,
  packRelations,
  packs,
  products,
  tags,
} from "../db/schema";

export async function getProductBySlug(slug: string) {
  const [product] = await db.select().from(products).where(eq(products.slug, slug));
  return product ?? null;
}

export async function getCategoriesForProduct(productId: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.productId, productId))
    .orderBy(categories.sortOrder);
}

/** Categorias com uma capa representativa e contagem de packs — tela "Categorias". */
export async function getCategoriesWithPreview(productId: string) {
  const cats = await getCategoriesForProduct(productId);

  const withPreview = await Promise.all(
    cats.map(async (c) => {
      const [row] = await db
        .select({
          coverUrl: packs.coverUrl,
          packCount: sql<number>`(select count(*) from ${packs} where ${packs.categoryId} = ${c.id})`,
        })
        .from(packs)
        .where(eq(packs.categoryId, c.id))
        .limit(1);

      return {
        ...c,
        coverUrl: row?.coverUrl ?? null,
        packCount: row?.packCount ?? 0,
      };
    })
  );

  return withPreview;
}

const packCardSelection = {
  id: packs.id,
  slug: packs.slug,
  name: packs.name,
  coverUrl: packs.coverUrl,
  isPremium: packs.isPremium,
  priceCents: packs.priceCents,
  categoryId: packs.categoryId,
  categoryName: categories.name,
  assetCount: sql<number>`(select count(*) from ${packAssets} where ${packAssets.packId} = ${packs.id})`,
};

/** Packs marcados como destaque pelo CMS (campo isFeatured) — carrossel "Em alta". */
export async function getFeaturedPacks(productId: string) {
  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(and(eq(packs.productId, productId), eq(packs.isFeatured, true)))
    .orderBy(desc(packs.createdAt));
}

/** Packs mais recentes — carrossel "Novidades" da Home. */
export async function getNewPacks(productId: string, limit = 15) {
  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(eq(packs.productId, productId))
    .orderBy(desc(packs.createdAt))
    .limit(limit);
}

/** Packs premium — carrossel "Premium" da Home. */
export async function getPremiumPacks(productId: string, limit = 15) {
  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(and(eq(packs.productId, productId), eq(packs.isPremium, true)))
    .orderBy(desc(packs.createdAt))
    .limit(limit);
}

/** Packs gratuitos — carrossel "Gratuitos" da Home. */
export async function getFreePacks(productId: string, limit = 15) {
  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(and(eq(packs.productId, productId), eq(packs.isPremium, false)))
    .orderBy(desc(packs.createdAt))
    .limit(limit);
}

/**
 * Packs ordenados pela soma de uso (usageCount) dos seus elementos — carrossel
 * "Mais utilizados" da Home. Duas etapas: primeiro rankeia os IDs por uso
 * agregado, depois busca os dados completos do card preservando a ordem.
 */
export async function getMostUsedPacks(productId: string, limit = 15) {
  const ranked = await db
    .select({
      id: packs.id,
      totalUsage: sql<number>`coalesce(sum(${digitalAssets.usageCount}), 0)`,
    })
    .from(packs)
    .leftJoin(packAssets, eq(packAssets.packId, packs.id))
    .leftJoin(digitalAssets, eq(digitalAssets.id, packAssets.assetId))
    .where(eq(packs.productId, productId))
    .groupBy(packs.id)
    .orderBy(desc(sql`coalesce(sum(${digitalAssets.usageCount}), 0)`))
    .limit(limit);

  return hydratePackOrder(ranked.map((r) => r.id));
}

/** Packs com pelo menos um elemento favoritado pelo usuário — carrossel "Favoritos". */
export async function getFavoritedPacksForUser(userId: string, productId: string, limit = 15) {
  const ranked = await db
    .select({
      id: packs.id,
      lastFavoritedAt: sql<number>`max(${favorites.createdAt})`,
    })
    .from(favorites)
    .innerJoin(digitalAssets, eq(digitalAssets.id, favorites.assetId))
    .innerJoin(packAssets, eq(packAssets.assetId, digitalAssets.id))
    .innerJoin(packs, eq(packs.id, packAssets.packId))
    .where(and(eq(favorites.userId, userId), eq(packs.productId, productId)))
    .groupBy(packs.id)
    .orderBy(desc(sql`max(${favorites.createdAt})`))
    .limit(limit);

  return hydratePackOrder(ranked.map((r) => r.id));
}

/**
 * Heurística simples de recomendação: outros packs das mesmas categorias que
 * o usuário já favoritou, excluindo os packs já vistos. Sem os sinais do
 * usuário (`categoryIds` vazio), retorna lista vazia — a Home decide o
 * fallback (ex: reaproveitar "Em alta").
 */
export async function getRecommendedPacks(
  productId: string,
  categoryIds: string[],
  excludeIds: string[],
  limit = 15
) {
  if (categoryIds.length === 0) return [];

  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(
      and(
        eq(packs.productId, productId),
        inArray(packs.categoryId, categoryIds),
        excludeIds.length > 0 ? notInArray(packs.id, excludeIds) : undefined
      )
    )
    .orderBy(desc(packs.isFeatured), desc(packs.createdAt))
    .limit(limit);
}

/** Busca os dados completos de cartão para uma lista de IDs, preservando a ordem dada. */
async function hydratePackOrder(ids: string[]) {
  if (ids.length === 0) return [];

  const rows = await db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(inArray(packs.id, ids));

  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is (typeof rows)[number] => r !== undefined);
}

/**
 * Todos os packs do catálogo — o grid principal de navegação da Home.
 * Filtra por categoria/nicho quando informado.
 */
export async function getAllPacks(
  productId: string,
  opts: { categoryId?: string } = {}
) {
  const conditions = [eq(packs.productId, productId)];
  if (opts.categoryId) conditions.push(eq(packs.categoryId, opts.categoryId));

  return db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(packs.createdAt));
}

/** Estatísticas do catálogo — reforça a percepção de abundância na Home. */
export async function getCatalogStats(productId: string) {
  const [packRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(packs)
    .where(eq(packs.productId, productId));

  const [assetRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(digitalAssets)
    .where(eq(digitalAssets.productId, productId));

  return { packCount: packRow?.total ?? 0, assetCount: assetRow?.total ?? 0 };
}

/** Verifica se o usuário tem acesso a um pack específico (premium ou não). */
export async function hasPackAccess(userId: string, pack: { id: string; isPremium: boolean }) {
  if (!pack.isPremium) return true;

  const [row] = await db
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.packId, pack.id),
        eq(entitlements.status, "active")
      )
    );

  return Boolean(row);
}

/**
 * Busca inteligente: procura por packs (nome/descrição/categoria) e por
 * elementos (nome/tags/categoria). Full-text simples via LIKE — suficiente
 * para o volume atual do catálogo; se crescer muito, trocar por um motor
 * dedicado (Postgres tsvector/pg_trgm ou Meilisearch/Typesense) sem mudar
 * a assinatura desta função.
 */
export async function searchCatalog(productId: string, query: string, userId: string) {
  const q = `%${query.toLowerCase()}%`;

  const matchingPacks = await db
    .select(packCardSelection)
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(
      and(
        eq(packs.productId, productId),
        or(
          like(sql`lower(${packs.name})`, q),
          like(sql`lower(${packs.description})`, q),
          like(sql`lower(${categories.name})`, q)
        )
      )
    );

  const matchingElements = await db
    .selectDistinct({
      id: digitalAssets.id,
      name: digitalAssets.name,
      previewUrl: digitalAssets.previewUrl,
      isNew: digitalAssets.isNew,
      isFavorited: sql<number>`(select count(*) from ${favorites} where ${favorites.assetId} = ${digitalAssets.id} and ${favorites.userId} = ${userId})`,
      packSlug: packs.slug,
    })
    .from(digitalAssets)
    .innerJoin(packAssets, eq(packAssets.assetId, digitalAssets.id))
    .innerJoin(packs, eq(packAssets.packId, packs.id))
    .leftJoin(categories, eq(digitalAssets.categoryId, categories.id))
    .leftJoin(assetTags, eq(assetTags.assetId, digitalAssets.id))
    .leftJoin(tags, eq(assetTags.tagId, tags.id))
    .where(
      and(
        eq(digitalAssets.productId, productId),
        or(
          like(sql`lower(${digitalAssets.name})`, q),
          like(sql`lower(${tags.name})`, q),
          like(sql`lower(${categories.name})`, q)
        )
      )
    );

  return { packs: matchingPacks, elements: matchingElements };
}

export async function getPackBySlug(productId: string, slug: string) {
  const [pack] = await db
    .select({
      id: packs.id,
      slug: packs.slug,
      name: packs.name,
      description: packs.description,
      coverUrl: packs.coverUrl,
      isPremium: packs.isPremium,
      priceCents: packs.priceCents,
      updatedAt: packs.updatedAt,
      categoryId: packs.categoryId,
      categoryName: categories.name,
      assetCount: sql<number>`(select count(*) from ${packAssets} where ${packAssets.packId} = ${packs.id})`,
    })
    .from(packs)
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(and(eq(packs.productId, productId), eq(packs.slug, slug)));

  return pack ?? null;
}

export type PackAssetFilter = "todos" | "novos" | "mais_usados" | "favoritos";

/** Elementos de um pack específico, com estado de favorito do usuário atual. */
export async function getPackAssets(
  packId: string,
  opts: { userId: string; filter?: PackAssetFilter }
) {
  const filter = opts.filter ?? "todos";

  const rows = await db
    .select({
      id: digitalAssets.id,
      name: digitalAssets.name,
      previewUrl: digitalAssets.previewUrl,
      isNew: digitalAssets.isNew,
      usageCount: digitalAssets.usageCount,
      isFavorited: sql<number>`(select count(*) from ${favorites} where ${favorites.assetId} = ${digitalAssets.id} and ${favorites.userId} = ${opts.userId})`,
    })
    .from(packAssets)
    .innerJoin(digitalAssets, eq(packAssets.assetId, digitalAssets.id))
    .where(eq(packAssets.packId, packId))
    .orderBy(desc(digitalAssets.isNew), packAssets.sortOrder);

  switch (filter) {
    case "novos":
      return rows.filter((r) => r.isNew);
    case "mais_usados":
      return [...rows].sort((a, b) => b.usageCount - a.usageCount);
    case "favoritos":
      return rows.filter((r) => r.isFavorited > 0);
    default:
      return rows;
  }
}

/** Packs relacionados (curadoria manual do CMS — Fase 4). */
export async function getRelatedPacks(packId: string) {
  const rows = await db
    .select({
      id: packs.id,
      slug: packs.slug,
      name: packs.name,
      coverUrl: packs.coverUrl,
      isPremium: packs.isPremium,
      priceCents: packs.priceCents,
      categoryName: categories.name,
      assetCount: sql<number>`(select count(*) from ${packAssets} where ${packAssets.packId} = ${packs.id})`,
    })
    .from(packRelations)
    .innerJoin(packs, eq(packRelations.relatedPackId, packs.id))
    .leftJoin(categories, eq(packs.categoryId, categories.id))
    .where(eq(packRelations.packId, packId))
    .orderBy(packRelations.sortOrder);

  return rows;
}

/** Um elemento específico + contexto do pack (para a tela de Preview). */
export async function getAssetWithPackContext(assetId: string, userId: string) {
  const [asset] = await db
    .select({
      id: digitalAssets.id,
      name: digitalAssets.name,
      previewUrl: digitalAssets.previewUrl,
      isNew: digitalAssets.isNew,
      isFavorited: sql<number>`(select count(*) from ${favorites} where ${favorites.assetId} = ${digitalAssets.id} and ${favorites.userId} = ${userId})`,
    })
    .from(digitalAssets)
    .where(eq(digitalAssets.id, assetId));

  if (!asset) return null;

  const [packRow] = await db
    .select({ slug: packs.slug, name: packs.name })
    .from(packAssets)
    .innerJoin(packs, eq(packAssets.packId, packs.id))
    .where(eq(packAssets.assetId, assetId))
    .limit(1);

  return { ...asset, pack: packRow ?? null };
}

/** Todos os elementos favoritados pelo usuário — tela "Favoritos". */
export async function getFavoritedAssets(userId: string, productId: string) {
  return db
    .select({
      id: digitalAssets.id,
      name: digitalAssets.name,
      previewUrl: digitalAssets.previewUrl,
      isNew: digitalAssets.isNew,
      isFavorited: sql<number>`1`,
    })
    .from(favorites)
    .innerJoin(digitalAssets, eq(favorites.assetId, digitalAssets.id))
    .where(and(eq(favorites.userId, userId), eq(digitalAssets.productId, productId)))
    .orderBy(desc(favorites.createdAt));
}
