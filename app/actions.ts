"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import { favorites, digitalAssets, analyticsEvents } from "@/lib/boost-engine/db/schema";
import { getCurrentUser } from "@/lib/boost-engine/services/users";

export async function toggleFavoriteAction(formData: FormData) {
  const assetId = formData.get("assetId");
  if (typeof assetId !== "string") return;

  const user = await getCurrentUser();

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.assetId, assetId)));

  if (existing) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.assetId, assetId)));
  } else {
    await db.insert(favorites).values({
      userId: user.id,
      assetId,
      createdAt: Date.now(),
    });
  }

  revalidatePath("/", "layout");
}

/**
 * Registra o uso real de um elemento ("Usar no Story"): incrementa o contador
 * de uso (alimenta o filtro "Mais usados") e grava um evento de analytics.
 * A ação de compartilhar de verdade (Web Share API) acontece no cliente,
 * no componente que chama esta action antes de disparar o compartilhamento.
 */
export async function recordUseInStoryAction(assetId: string) {
  const user = await getCurrentUser();

  await db
    .update(digitalAssets)
    .set({ usageCount: sql`${digitalAssets.usageCount} + 1` })
    .where(eq(digitalAssets.id, assetId));

  const [asset] = await db
    .select({ productId: digitalAssets.productId })
    .from(digitalAssets)
    .where(eq(digitalAssets.id, assetId));

  if (asset) {
    await db.insert(analyticsEvents).values({
      id: crypto.randomUUID(),
      userId: user.id,
      productId: asset.productId,
      eventType: "use_in_story",
      entityType: "asset",
      entityId: assetId,
      createdAt: Date.now(),
    });
  }

  revalidatePath("/", "layout");
}
