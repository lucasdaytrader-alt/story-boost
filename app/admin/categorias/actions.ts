"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import { categories, packs } from "@/lib/boost-engine/db/schema";
import { requireAdmin } from "@/lib/boost-engine/services/auth";
import { getProductBySlug, getCategoriesForProduct } from "@/lib/boost-engine/services/content";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CategoryActionState = { error?: string; success?: boolean } | null;

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome da categoria." };

  const product = await getProductBySlug("story-boost");
  if (!product) return { error: "Produto não encontrado." };

  const existing = await getCategoriesForProduct(product.id);
  const slug = slugify(name);

  if (existing.some((c) => c.slug === slug)) {
    return { error: "Já existe uma categoria com esse nome." };
  }

  await db.insert(categories).values({
    id: crypto.randomUUID(),
    productId: product.id,
    name,
    slug,
    sortOrder: existing.length,
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categorias");

  return { success: true };
}

export async function updateCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!categoryId || !name) return { error: "Nome é obrigatório." };

  await db.update(categories).set({ name }).where(eq(categories.id, categoryId));

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categorias");

  return { success: true };
}

export async function deleteCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "");
  if (!categoryId) return { error: "Categoria inválida." };

  const [packUsingCategory] = await db
    .select({ id: packs.id })
    .from(packs)
    .where(eq(packs.categoryId, categoryId));

  if (packUsingCategory) {
    return { error: "Esta categoria tem packs vinculados. Mova ou exclua os packs antes." };
  }

  await db.delete(categories).where(eq(categories.id, categoryId));

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categorias");

  return { success: true };
}
