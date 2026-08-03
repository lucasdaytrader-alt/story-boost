/**
 * Boost Engine — Schema de dados
 *
 * IMPORTANTE: este schema é a "camada core" reutilizável da plataforma.
 * Nenhuma tabela fala em "adesivo" — tudo é modelado como DigitalAsset genérico,
 * para permitir futuros produtos (templates, ícones, presets etc.) sem remodelar o banco.
 *
 * Story Boost® é o primeiro "Product" registrado sobre esta estrutura.
 */

import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// Product — cada app construído sobre o Boost Engine é um "Product"
// ---------------------------------------------------------------------------
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: integer("created_at").notNull(),
});

// ---------------------------------------------------------------------------
// Categories — sempre vinculadas a um Product
// ---------------------------------------------------------------------------
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------------------------------------------------------------------
// Tags — vocabulário livre usado pela busca inteligente
// ---------------------------------------------------------------------------
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// ---------------------------------------------------------------------------
// DigitalAsset — entidade genérica (sticker hoje; template/ícone/preset amanhã)
// ---------------------------------------------------------------------------
export const digitalAssets = sqliteTable("digital_assets", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  categoryId: text("category_id").references(() => categories.id),
  type: text("type").notNull().default("sticker"), // sticker | template | icon | preset ...
  name: text("name").notNull(),
  previewUrl: text("preview_url").notNull(),
  fileUrl: text("file_url").notNull(),
  isNew: integer("is_new", { mode: "boolean" }).notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const assetTags = sqliteTable(
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
export const packs = sqliteTable("packs", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  categoryId: text("category_id").references(() => categories.id),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url").notNull(),
  isPremium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  priceCents: integer("price_cents"), // null se gratuito
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const packAssets = sqliteTable(
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
export const packRelations = sqliteTable(
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
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"), // null se conta social (Google/Apple)
  authProvider: text("auth_provider").notNull().default("email"), // email | google | apple
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});

// ---------------------------------------------------------------------------
// Devices/Sessions — limite de 2 dispositivos simultâneos (regra da Fase 2)
// ---------------------------------------------------------------------------
export const devices = sqliteTable("devices", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  deviceModel: text("device_model").notNull(),
  os: text("os").notNull(),
  approxLocation: text("approx_location"),
  lastAccessAt: integer("last_access_at").notNull(),
  createdAt: integer("created_at").notNull(),
});

// ---------------------------------------------------------------------------
// Entitlements — licenciamento. Hoje sempre "active" (ADR-003: sem gateway
// de pagamento ainda). O "buraco" para o gateway plugar depois já existe aqui.
// ---------------------------------------------------------------------------
export const entitlements = sqliteTable("entitlements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull().references(() => products.id),
  packId: text("pack_id").references(() => packs.id), // null = acesso ao catálogo principal
  status: text("status").notNull().default("active"), // active | revoked
  source: text("source").notNull().default("stub"), // stub | iap_apple | iap_google | gateway
  grantedAt: integer("granted_at").notNull(),
});

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------
export const favorites = sqliteTable(
  "favorites",
  {
    userId: text("user_id").notNull().references(() => users.id),
    assetId: text("asset_id").notNull().references(() => digitalAssets.id),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.assetId] })]
);

// ---------------------------------------------------------------------------
// Analytics — eventos genéricos (view, search, favorite, share, use_in_story)
// Alimenta o filtro "Mais usados" e o relatório de "buscas sem resultado" do CMS.
// ---------------------------------------------------------------------------
export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  productId: text("product_id").notNull().references(() => products.id),
  eventType: text("event_type").notNull(), // view | search | favorite | share | use_in_story
  entityType: text("entity_type"), // asset | pack | category
  entityId: text("entity_id"),
  query: text("query"), // usado quando eventType = search
  createdAt: integer("created_at").notNull(),
});
