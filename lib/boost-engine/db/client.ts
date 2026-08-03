/**
 * Boost Engine — Conexão com o banco de dados
 *
 * Postgres (Neon), via driver HTTP serverless — funciona tanto em dev local
 * quanto nas funções serverless da Vercel (sem pool de conexões TCP, que não
 * sobrevive bem a esse ambiente). Antes disso o projeto usava SQLite local
 * (node:sqlite): funcionava em dev, mas quebrava em produção na Vercel, cujo
 * filesystem é somente-leitura/efêmero fora de /tmp.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

try {
  // Fora do Next.js (scripts tsx como migrate/seed) ninguém carrega .env.local
  // automaticamente. Em produção na Vercel o arquivo não existe — e não faz
  // falta, porque as env vars já vêm injetadas pela integração com o banco.
  process.loadEnvFile(".env.local");
} catch {
  // .env.local ausente: segue com o que já estiver em process.env.
}

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não configurada. Defina em .env.local (dev) ou nas variáveis de ambiente do projeto na Vercel (prod)."
  );
}

// O App Router do Next.js substitui o fetch global para aplicar seu Data
// Cache. Sem desativar isso aqui, as chamadas HTTP internas do driver da Neon
// ficam sujeitas a essa camada e falham ("Failed query") sob next dev/Turbopack.
const sql = neon(connectionString, { fetchOptions: { cache: "no-store" } });

export const db = drizzle(sql, { schema });
