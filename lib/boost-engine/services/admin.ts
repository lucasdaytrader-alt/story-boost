import { sql } from "drizzle-orm";
import { db } from "../db/client";
import { categories, digitalAssets, packs, users } from "../db/schema";

export async function getAdminOverview(productId: string) {
  const [packCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(packs);
  const [categoryCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(categories);
  const [assetCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(digitalAssets);
  const [userCount] = await db.select({ total: sql<number>`count(*)` }).from(users);

  return {
    packCount: packCount?.total ?? 0,
    categoryCount: categoryCount?.total ?? 0,
    assetCount: assetCount?.total ?? 0,
    userCount: userCount?.total ?? 0,
    productId,
  };
}
