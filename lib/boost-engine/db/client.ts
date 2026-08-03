/**
 * Boost Engine — Conexão com o banco de dados
 *
 * Desenvolvimento: SQLite nativo do Node (node:sqlite), zero configuração.
 * Produção (futuro): trocar para Postgres/Supabase é só trocar este arquivo —
 * o restante da aplicação usa apenas `db` (instância Drizzle) e nunca fala
 * diretamente com o driver.
 */

import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import path from "node:path";
import * as schema from "./schema";

const DB_PATH = path.join(process.cwd(), "data", "story-boost.db");

// Uma única conexão reaproveitada entre requisições (padrão recomendado para
// SQLite em dev com Next.js hot-reload).
declare global {
  // eslint-disable-next-line no-var
  var __boostEngineSqlite: DatabaseSync | undefined;
}

export const sqlite =
  globalThis.__boostEngineSqlite ?? new DatabaseSync(DB_PATH);

if (process.env.NODE_ENV !== "production") {
  globalThis.__boostEngineSqlite = sqlite;
}

export const db = drizzle(
  async (sqlQuery, params, method) => {
    const stmt = sqlite.prepare(sqlQuery);
    if (method === "run") {
      const info = stmt.run(...params);
      return { rows: [], ...{ lastInsertRowid: info.lastInsertRowid } } as {
        rows: unknown[];
      };
    }
    // IMPORTANTE: setReturnArrays(true) faz o node:sqlite devolver cada linha
    // como array posicional em vez de objeto nomeado. Sem isso, duas colunas
    // com o mesmo nome (ex: packs.name e categories.name em um JOIN) colidem
    // no objeto resultante e corrompem a ordem dos valores subsequentes —
    // bug real encontrado e corrigido durante a Sprint 2.
    stmt.setReturnArrays(true);
    const rows = stmt.all(...params) as unknown as unknown[][];
    return { rows };
  },
  { schema, casing: "snake_case" }
);
