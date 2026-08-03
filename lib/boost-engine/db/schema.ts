/**
 * Boost Engine — Schema de dados
 *
 * IMPORTANTE: este schema é a "camada core" reutilizável da plataforma.
 * Nenhuma tabela fala em "adesivo" — tudo é modelado como DigitalAsset genérico,
 * para permitir futuros produtos (templates, ícones, presets etc.) sem remodelar o banco.
 *
 * Story Boost® é o primeiro "Product" registrado sobre esta estrutura.
 *
 * Postgres (Neon), não SQLite: campos que guardam timestamp em epoch-ms usam
 * `bigint(mode:"number")` porque o `integer` do Postgres é 32 bits e estoura
 * com Date.now() — no SQLite isso não era um problema (integer lá é 64 bits).
 */

import { pgTable, text, integer, bigint, boolean, primaryKey } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Product — cada app construído sobre o Boost Engine é um "Product"
// ---------------------------------------------------------------------------
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

// ---------------------------------------------------------------------------
// Categories — sempre vinculadas a um Product
// ---------------------------------------------------------------------------
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Tags — vocabulário livre usado pela busca inteligente
// ---------------------------------------------------------------------------
export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// ---------------------------------------------------------------------------
// DigitalAsset — entidade genérica (sticker hoje; template/ícone/preset amanhã)
// ---------------------------------------------------------------------------
export const digitalAssets = pgTable("digital_assets", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  categoryId: text("category_id").references(() => categories.id),
  type: text("type").notNull().default("sticker"), // sticker | template | icon | preset ...
  name: text("name").notNull(),
  previewUrl: text("preview_url").notNull(),
  fileUrl: text("file_url").notNull(),
  isNew: boolean("is_new").notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const assetTags = pgTable(
  "asset_tags",
  {
    assetId: text("asset_id").notNull().references(() => digitalAssets.id),
    tagId: text("tag_id").notNull().references(() => tags.id),
  },
  (t) => [primaryKey({ columns: [t.assetId, t.tagId] })]
);

// ---------------------------------------------------------------------------
// Packs — agrupam DigitalAssets; podem ser gratuitos ou premium
// ---------------------------------------------------------------------------
export const packs = pgTable("packs", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  categoryId: text("category_id").references(() => categories.id),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url").notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  priceCents: integer("price_cents"), // null se gratuito
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});

export const packAssets = pgTable(
  "pack_assets",
  {
    packId: text("pack_id").notNull().references(() => packs.id),
    assetId: text("asset_id").notNull().references(() => digitalAssets.id),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.packId, t.assetId] })]
);

// ---------------------------------------------------------------------------
// PackRelation — "Relacionados". Origem preparada para evolução futura
// (manual hoje; tag_similarity / co_access / behavior no futuro), sem
// necessidade de remodelar a tabela — só passamos a inserir com outra origem.
// ---------------------------------------------------------------------------
export const packRelations = pgTable(
  "pack_relations",
  {
    packId: text("pack_id").notNull().references(() => packs.id),
    relatedPackId: text("related_pack_id").notNull().references(() => packs.id),
    source: text("source").notNull().default("manual"), // manual | tag_similarity | co_access | behavior
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.packId, t.relatedPackId] })]
);

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"), // null se conta social (Google/Apple)
  authProvider: text("auth_provider").notNull().default("email"), // email | google | apple
  isAdmin: boolean("is_admin").notNull().default(false),
  plan: text("plan"), // rótulo livre definido pelo admin ao criar a conta (ex: "Mensal", "Vitalício")
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

// ---------------------------------------------------------------------------
// Devices/Sessions — limite de 2 dispositivos simultâneos (regra da Fase 2)
// ---------------------------------------------------------------------------
export const devices = pgTable("devices", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  deviceModel: text("device_model").notNull(),
  os: text("os").notNull(),
  approxLocation: text("approx_location"),
  lastAccessAt: bigint("last_access_at", { mode: "number" }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

// ---------------------------------------------------------------------------
// Entitlements — licenciamento. Hoje sempre "active" (ADR-003: sem gateway
// de pagamento ainda). O "buraco" para o gateway plugar depois já existe aqui.
// ---------------------------------------------------------------------------
export const entitlements = pgTable("entitlements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull().references(() => products.id),
  packId: text("pack_id").references(() => packs.id), // null = acesso ao catálogo principal
  status: text("status").notNull().default("active"), // active | revoked
  source: text("source").notNull().default("stub"), // stub | manual | iap_apple | iap_google | gateway
  grantedAt: bigint("granted_at", { mode: "number" }).notNull(),
});

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------
export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id").notNull().references(() => users.id),
    assetId: text("asset_id").notNull().references(() => digitalAssets.id),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.assetId] })]
);

// ---------------------------------------------------------------------------
// Analytics — eventos genéricos (view, search, favorite, share, use_in_story)
// Alimenta o filtro "Mais usados" e o relatório de "buscas sem resultado" do CMS.
// ---------------------------------------------------------------------------
export const analyticsEvents = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  productId: text("product_id").notNull().references(() => products.id),
  eventType: text("event_type").notNull(), // view | search | favorite | share | use_in_story
  entityType: text("entity_type"), // asset | pack | category
  entityId: text("entity_id"),
  query: text("query"), // usado quando eventType = search
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});
