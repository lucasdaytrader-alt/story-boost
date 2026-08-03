"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/boost-engine/db/client";
import { entitlements, packs } from "@/lib/boost-engine/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/boost-engine/services/auth";

/**
 * Compra de um Pack Premium.
 *
 * ADR-003/ADR-005: o gateway de pagamento real (Cakto/Stripe/Mercado Pago)
 * ainda não está integrado. Esta action grava o Entitlement diretamente,
 * simulando uma aprovação instantânea — é a MESMA tabela e o MESMO formato
 * que o webhook do gateway real vai preencher no futuro. Trocar isso por uma
 * integração real é substituir esta função, não a arquitetura.
 */
export async function purchasePackAction(formData: FormData) {
  const packId = formData.get("packId");
  if (typeof packId !== "string") return;

  const user = await requireUser();

  const [pack] = await db.select().from(packs).where(eq(packs.id, packId));
  if (!pack) return;

  await db.insert(entitlements).values({
    id: crypto.randomUUID(),
    userId: user.id,
    productId: pack.productId,
    packId: pack.id,
    status: "active",
    source: "simulated_purchase",
    grantedAt: Date.now(),
  });

  revalidatePath(`/pack/${pack.slug}`);
}
