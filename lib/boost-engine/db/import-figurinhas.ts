/**
 * Boost Engine — Import de figurinhas a partir de uma pasta local
 *
 * Uso: npm run import:figurinhas -- "C:\caminho\para\pasta"
 *
 * Espera uma pasta no formato de export do Google Drive: cada subpasta de
 * primeiro nível vira um Pack, e cada imagem dentro dela vira um DigitalAsset
 * (type "sticker") pertencente a esse pack. As imagens são copiadas para
 * public/uploads/figurinhas/<slug-do-pack>/ e servidas pelo Next.js, seguindo
 * o mesmo padrão do serviço de storage (services/storage.ts).
 *
 * categoryId fica nulo — a curadoria de categoria é manual via CMS, igual ao
 * padrão já usado para packRelations e isFeatured (ver schema.ts).
 *
 * Idempotente: se um pack com o mesmo nome de pasta já existe para o produto,
 * a pasta inteira é pulada (permite rodar de novo sem duplicar).
 */

import { mkdir, readdir, copyFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { runMigrations } from "./migrate";
import { db } from "./client";
import { products, packs, packAssets, digitalAssets } from "./schema";
import { eq } from "drizzle-orm";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const UPLOADS_SUBDIR = "figurinhas";

const uid = () => crypto.randomUUID();

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function assetNameFromFile(fileStem: string, packName: string) {
  const trimmed = fileStem.trim();
  if (/^\d+$/.test(trimmed)) return `${packName} ${trimmed}`;
  return trimmed.replace(/[_-]+/g, " ").trim() || packName;
}

async function main() {
  const rootArg = process.argv[2];
  if (!rootArg) {
    console.error(
      '❌ Uso: npm run import:figurinhas -- "C:\\caminho\\para\\pasta"'
    );
    process.exit(1);
  }

  const rootPath = path.resolve(rootArg);
  if (!existsSync(rootPath) || !statSync(rootPath).isDirectory()) {
    console.error(`❌ Pasta não encontrada: ${rootPath}`);
    process.exit(1);
  }

  await runMigrations();

  console.log(`📂 Importando figurinhas de: ${rootPath}`);

  // ---- Product: reaproveita "story-boost" se existir, cria se não -------
  let [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, "story-boost"));

  if (!product) {
    const id = uid();
    await db.insert(products).values({
      id,
      slug: "story-boost",
      name: "Story Boost",
      createdAt: Date.now(),
    });
    product = { id, slug: "story-boost", name: "Story Boost", createdAt: Date.now() };
    console.log("ℹ️  Produto 'story-boost' não existia — criado agora.");
  }

  const existingPacks = await db
    .select({ name: packs.name, slug: packs.slug })
    .from(packs)
    .where(eq(packs.productId, product.id));

  const existingNames = new Set(existingPacks.map((p) => p.name));
  const existingSlugs = new Set(existingPacks.map((p) => p.slug));

  const uploadsRoot = path.join(process.cwd(), "public", "uploads", UPLOADS_SUBDIR);

  const entries = await readdir(rootPath, { withFileTypes: true });
  const packDirs = entries.filter((e) => e.isDirectory());
  const strayFiles = entries.filter((e) => e.isFile());

  if (strayFiles.length) {
    console.warn(
      `⚠️  ${strayFiles.length} arquivo(s) soltos na raiz da pasta foram ignorados (esperado: uma subpasta por pack).`
    );
  }

  let packsCreated = 0;
  let packsSkipped = 0;
  let assetsCreated = 0;
  let filesIgnored = 0;

  for (const dirEntry of packDirs) {
    const packName = dirEntry.name.trim();

    if (existingNames.has(packName)) {
      packsSkipped++;
      console.log(`⏭️  Pack "${packName}" já importado — pulando.`);
      continue;
    }

    const packDirPath = path.join(rootPath, dirEntry.name);
    const fileNames = (await readdir(packDirPath, { withFileTypes: true }))
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .filter((name) => {
        const ok = ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase());
        if (!ok) filesIgnored++;
        return ok;
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    if (fileNames.length === 0) {
      console.warn(`⚠️  Pack "${packName}" não tem imagens válidas — pulando.`);
      continue;
    }

    let slug = slugify(packName) || uid();
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${slugify(packName)}-${suffix++}`;
    }
    existingSlugs.add(slug);

    const packUploadsDir = path.join(uploadsRoot, slug);
    await mkdir(packUploadsDir, { recursive: true });

    const assetEntries: { id: string; name: string; url: string }[] = [];

    for (const fileName of fileNames) {
      const ext = path.extname(fileName).toLowerCase();
      const destFileName = `${uid()}${ext}`;
      await copyFile(
        path.join(packDirPath, fileName),
        path.join(packUploadsDir, destFileName)
      );

      const url = `/uploads/${UPLOADS_SUBDIR}/${slug}/${destFileName}`;
      const name = assetNameFromFile(path.parse(fileName).name, packName);

      assetEntries.push({ id: uid(), name, url });
    }

    const now = Date.now();

    for (const asset of assetEntries) {
      await db.insert(digitalAssets).values({
        id: asset.id,
        productId: product.id,
        categoryId: null,
        type: "sticker",
        name: asset.name,
        previewUrl: asset.url,
        fileUrl: asset.url,
        isNew: false,
        usageCount: 0,
        createdAt: now,
      });
    }
    assetsCreated += assetEntries.length;

    const packId = uid();
    await db.insert(packs).values({
      id: packId,
      productId: product.id,
      categoryId: null,
      slug,
      name: packName,
      description: null,
      coverUrl: assetEntries[0].url,
      isPremium: false,
      isFeatured: false,
      priceCents: null,
      createdAt: now,
      updatedAt: now,
    });

    for (const [index, asset] of assetEntries.entries()) {
      await db.insert(packAssets).values({
        packId,
        assetId: asset.id,
        sortOrder: index,
      });
    }

    existingNames.add(packName);
    packsCreated++;
    console.log(`✅ Pack "${packName}" importado com ${assetEntries.length} figurinha(s).`);
  }

  console.log("");
  console.log("✅ Import concluído:");
  console.log(`   - ${packsCreated} pack(s) criado(s)`);
  console.log(`   - ${packsSkipped} pack(s) já existentes (pulados)`);
  console.log(`   - ${assetsCreated} figurinha(s) importada(s)`);
  if (filesIgnored) {
    console.log(`   - ${filesIgnored} arquivo(s) ignorado(s) (extensão não suportada)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erro no import:", err);
    process.exit(1);
  });
