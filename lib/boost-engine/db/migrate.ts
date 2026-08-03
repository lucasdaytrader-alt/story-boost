/**
 * Boost Engine — Migração inicial (DDL)
 *
 * Para o MVP local, aplicamos o DDL diretamente via SQL (sem CLI de migração),
 * dado que o ambiente de desenvolvimento não tem acesso a binários externos
 * de ferramentas de migração. Quando migrarmos para Postgres/Supabase em
 * produção, isso vira migrations formais (ex: drizzle-kit ou SQL versionado).
 */

import { sqlite } from "./client";

export function runMigrations() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS digital_assets (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      category_id TEXT REFERENCES categories(id),
      type TEXT NOT NULL DEFAULT 'sticker',
      name TEXT NOT NULL,
      preview_url TEXT NOT NULL,
      file_url TEXT NOT NULL,
      is_new INTEGER NOT NULL DEFAULT 0,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS asset_tags (
      asset_id TEXT NOT NULL REFERENCES digital_assets(id),
      tag_id TEXT NOT NULL REFERENCES tags(id),
      PRIMARY KEY (asset_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      category_id TEXT REFERENCES categories(id),
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      cover_url TEXT NOT NULL,
      is_premium INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      price_cents INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pack_assets (
      pack_id TEXT NOT NULL REFERENCES packs(id),
      asset_id TEXT NOT NULL REFERENCES digital_assets(id),
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (pack_id, asset_id)
    );

    CREATE TABLE IF NOT EXISTS pack_relations (
      pack_id TEXT NOT NULL REFERENCES packs(id),
      related_pack_id TEXT NOT NULL REFERENCES packs(id),
      source TEXT NOT NULL DEFAULT 'manual',
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (pack_id, related_pack_id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatar_url TEXT,
      password_hash TEXT,
      auth_provider TEXT NOT NULL DEFAULT 'email',
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      session_token TEXT NOT NULL UNIQUE,
      device_model TEXT NOT NULL,
      os TEXT NOT NULL,
      approx_location TEXT,
      last_access_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      pack_id TEXT REFERENCES packs(id),
      status TEXT NOT NULL DEFAULT 'active',
      source TEXT NOT NULL DEFAULT 'stub',
      granted_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL REFERENCES users(id),
      asset_id TEXT NOT NULL REFERENCES digital_assets(id),
      created_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, asset_id)
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      event_type TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      query TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  console.log("✅ Migrações aplicadas com sucesso.");
}

if (require.main === module) {
  runMigrations();
}
