/**
 * Boost Engine — Serviço de armazenamento
 *
 * MVP: salva arquivos em /public/uploads (disco local), servidos diretamente
 * pelo Next.js. Produção (ADR-002): troca para S3/Cloudflare R2 + CDN — só
 * esta função muda, o restante do sistema usa apenas a URL retornada.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function safeExtension(filename: string, fallback: string) {
  const ext = path.extname(filename).toLowerCase();
  return ext || fallback;
}

export async function saveUploadedFile(
  file: File,
  opts: { subfolder: string; allowedTypes?: string[] }
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!file || file.size === 0) {
    return { ok: false, error: "Nenhum arquivo enviado." };
  }

  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    return {
      ok: false,
      error: `Tipo de arquivo não permitido (${file.type || "desconhecido"}). Envie: ${opts.allowedTypes.join(", ")}.`,
    };
  }

  const dir = path.join(UPLOADS_DIR, opts.subfolder);
  await mkdir(dir, { recursive: true });

  const ext = safeExtension(file.name, file.type === "image/png" ? ".png" : ".jpg");
  const filename = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { ok: true, url: `/uploads/${opts.subfolder}/${filename}` };
}
