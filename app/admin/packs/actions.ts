"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import {
  assetTags,
  digitalAssets,
  favorites,
  packAssets,
  packRelations,
  packs,
  tags,
} from "@/lib/boost-engine/db/schema";
import { requireAdmin } from "@/lib/boost-engine/services/auth";
import { getAllPacks, getProductBySlug } from "@/lib/boost-engine/services/content";
import { saveUploadedFile } from "@/lib/boost-engine/services/storage";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function humanizeFilename(filename: string) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Elemento sem nome";
}

async function upsertTagsAndLink(assetId: string, tagsRaw: string) {
  const tagNames = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  for (const tagName of tagNames) {
    let [tag] = await db.select().from(tags).where(eq(tags.name, tagName));
    if (!tag) {
      const [inserted] = await db
        .insert(tags)
        .values({ id: crypto.randomUUID(), name: tagName })
        .returning();
      tag = inserted;
    }
    await db.insert(assetTags).values({ assetId, tagId: tag.id });
  }
}

// ---------------------------------------------------------------------------
// PACKS
// ---------------------------------------------------------------------------

export type PackActionState = { error?: string; success?: boolean } | null;

export async function createPackAction(
  _prevState: PackActionState,
  formData: FormData
): Promise<PackActionState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const isPremium = formData.get("isPremium") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const priceReais = String(formData.get("price") ?? "").replace(",", ".");
  const cover = formData.get("cover") as File | null;

  if (!name || !categoryId) {
    return { error: "Nome e categoria são obrigatórios." };
  }
  if (isPremium && (!priceReais || Number(priceReais) <= 0)) {
    return { error: "Informe um preço válido para um pack Premium." };
  }
  if (!cover || cover.size === 0) {
    return { error: "Envie uma imagem de capa." };
  }

  const product = await getProductBySlug("story-boost");
  if (!product) return { error: "Produto não encontrado." };

  const existingPacks = await getAllPacks(product.id);
  const slug = slugify(name);
  if (existingPacks.some((p) => p.slug === slug)) {
    return { error: "Já existe um pack com esse nome." };
  }

  const upload = await saveUploadedFile(cover, {
    subfolder: "packs",
    allowedTypes: ["image/png", "image/jpeg", "image/webp"],
  });
  if (!upload.ok) return { error: upload.error };

  const now = Date.now();
  await db.insert(packs).values({
    id: crypto.randomUUID(),
    productId: product.id,
    categoryId,
    slug,
    name,
    description: description || null,
    coverUrl: upload.url,
    isPremium,
    isFeatured,
    priceCents: isPremium ? Math.round(Number(priceReais) * 100) : null,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/packs");
  revalidatePath("/");
  revalidatePath("/categorias");

  redirect(`/admin/packs/${slug}`);
}

export async function updatePackAction(
  _prevState: PackActionState,
  formData: FormData
): Promise<PackActionState> {
  await requireAdmin();

  const packId = String(formData.get("packId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const isPremium = formData.get("isPremium") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const priceReais = String(formData.get("price") ?? "").replace(",", ".");
  const cover = formData.get("cover") as File | null;

  if (!packId || !name || !categoryId) {
    return { error: "Nome e categoria são obrigatórios." };
  }
  if (isPremium && (!priceReais || Number(priceReais) <= 0)) {
    return { error: "Informe um preço válido para um pack Premium." };
  }

  const [pack] = await db.select().from(packs).where(eq(packs.id, packId));
  if (!pack) return { error: "Pack não encontrado." };

  let coverUrl = pack.coverUrl;
  if (cover && cover.size > 0) {
    const upload = await saveUploadedFile(cover, {
      subfolder: "packs",
      allowedTypes: ["image/png", "image/jpeg", "image/webp"],
    });
    if (!upload.ok) return { error: upload.error };
    coverUrl = upload.url;
  }

  await db
    .update(packs)
    .set({
      name,
      description: description || null,
      categoryId,
      isPremium,
      isFeatured,
      priceCents: isPremium ? Math.round(Number(priceReais) * 100) : null,
      coverUrl,
      updatedAt: Date.now(),
    })
    .where(eq(packs.id, packId));

  revalidatePath("/admin/packs");
  revalidatePath(`/admin/packs/${pack.slug}`);
  revalidatePath(`/pack/${pack.slug}`);
  revalidatePath("/");
  revalidatePath("/categorias");

  return { success: true };
}

export async function deletePackAction(formData: FormData) {
  await requireAdmin();

  const packId = String(formData.get("packId") ?? "");
  if (!packId) return;

  const assetRows = await db
    .select({ assetId: packAssets.assetId })
    .from(packAssets)
    .where(eq(packAssets.packId, packId));
  const assetIds = assetRows.map((r) => r.assetId);

  for (const assetId of assetIds) {
    await db.delete(assetTags).where(eq(assetTags.assetId, assetId));
    await db.delete(favorites).where(eq(favorites.assetId, assetId));
  }
  await db.delete(packAssets).where(eq(packAssets.packId, packId));
  for (const assetId of assetIds) {
    await db.delete(digitalAssets).where(eq(digitalAssets.id, assetId));
  }
  await db.delete(packRelations).where(eq(packRelations.packId, packId));
  await db.delete(packRelations).where(eq(packRelations.relatedPackId, packId));
  await db.delete(packs).where(eq(packs.id, packId));

  revalidatePath("/admin/packs");
  revalidatePath("/");
  revalidatePath("/categorias");
}

// ---------------------------------------------------------------------------
// ELEMENTOS (upload individual ou em lote)
// ---------------------------------------------------------------------------

export type ElementActionState = { error?: string; success?: boolean; count?: number } | null;

export async function createElementsAction(
  _prevState: ElementActionState,
  formData: FormData
): Promise<ElementActionState> {
  await requireAdmin();

  const packSlug = String(formData.get("packSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const isNew = formData.get("isNew") === "on";
  const tagsRaw = String(formData.get("tags") ?? "");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (!packSlug) return { error: "Pack inválido." };
  if (files.length === 0) return { error: "Selecione ao menos um arquivo PNG." };

  const [pack] = await db.select().from(packs).where(eq(packs.slug, packSlug));
  if (!pack) return { error: "Pack não encontrado." };

  const [{ maxOrder } = { maxOrder: -1 }] = await db
    .select({ maxOrder: packAssets.sortOrder })
    .from(packAssets)
    .where(eq(packAssets.packId, pack.id))
    .orderBy(packAssets.sortOrder);

  let nextOrder = (maxOrder ?? -1) + 1;
  let created = 0;

  for (const file of files) {
    const upload = await saveUploadedFile(file, {
      subfolder: "elementos",
      allowedTypes: ["image/png"],
    });
    if (!upload.ok) continue; // pula arquivos inválidos, mas segue com o restante do lote

    const assetId = crypto.randomUUID();
    const elementName = files.length === 1 && name ? name : humanizeFilename(file.name);
    const now = Date.now();

    await db.insert(digitalAssets).values({
      id: assetId,
      productId: pack.productId,
      categoryId: pack.categoryId,
      type: "sticker",
      name: elementName,
      previewUrl: upload.url,
      fileUrl: upload.url,
      isNew,
      usageCount: 0,
      createdAt: now,
    });

    await db.insert(packAssets).values({ packId: pack.id, assetId, sortOrder: nextOrder++ });
    await upsertTagsAndLink(assetId, tagsRaw);
    created++;
  }

  if (created === 0) {
    return { error: "Nenhum arquivo válido foi enviado (apenas PNG é aceito)." };
  }

  await db.update(packs).set({ updatedAt: Date.now() }).where(eq(packs.id, pack.id));

  revalidatePath(`/admin/packs/${packSlug}`);
  revalidatePath(`/pack/${packSlug}`);
  revalidatePath("/");

  return { success: true, count: created };
}

export async function updateElementAction(
  _prevState: ElementActionState,
  formData: FormData
): Promise<ElementActionState> {
  await requireAdmin();

  const assetId = String(formData.get("assetId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const isNew = formData.get("isNew") === "on";
  const tagsRaw = String(formData.get("tags") ?? "");
  const file = formData.get("file") as File | null;

  if (!assetId || !name) return { error: "Nome é obrigatório." };

  const [asset] = await db.select().from(digitalAssets).where(eq(digitalAssets.id, assetId));
  if (!asset) return { error: "Elemento não encontrado." };

  let previewUrl = asset.previewUrl;
  let fileUrl = asset.fileUrl;
  if (file && file.size > 0) {
    const upload = await saveUploadedFile(file, { subfolder: "elementos", allowedTypes: ["image/png"] });
    if (!upload.ok) return { error: upload.error };
    previewUrl = upload.url;
    fileUrl = upload.url;
  }

  await db
    .update(digitalAssets)
    .set({ name, isNew, previewUrl, fileUrl })
    .where(eq(digitalAssets.id, assetId));

  await db.delete(assetTags).where(eq(assetTags.assetId, assetId));
  await upsertTagsAndLink(assetId, tagsRaw);

  const [packRow] = await db
    .select({ slug: packs.slug })
    .from(packAssets)
    .innerJoin(packs, eq(packAssets.packId, packs.id))
    .where(eq(packAssets.assetId, assetId));

  if (packRow) {
    revalidatePath(`/admin/packs/${packRow.slug}`);
    revalidatePath(`/pack/${packRow.slug}`);
  }
  revalidatePath("/");

  return { success: true };
}

export async function deleteElementAction(formData: FormData) {
  await requireAdmin();

  const assetId = String(formData.get("assetId") ?? "");
  if (!assetId) return;

  const [packRow] = await db
    .select({ slug: packs.slug })
    .from(packAssets)
    .innerJoin(packs, eq(packAssets.packId, packs.id))
    .where(eq(packAssets.assetId, assetId));

  await db.delete(assetTags).where(eq(assetTags.assetId, assetId));
  await db.delete(favorites).where(eq(favorites.assetId, assetId));
  await db.delete(packAssets).where(eq(packAssets.assetId, assetId));
  await db.delete(digitalAssets).where(eq(digitalAssets.id, assetId));

  if (packRow) {
    revalidatePath(`/admin/packs/${packRow.slug}`);
    revalidatePath(`/pack/${packRow.slug}`);
  }
  revalidatePath("/");
}
