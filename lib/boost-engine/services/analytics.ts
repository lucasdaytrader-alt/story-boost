import { db } from "../db/client";
import { analyticsEvents } from "../db/schema";

export async function recordSearchEvent(opts: {
  productId: string;
  userId: string;
  query: string;
  resultCount: number;
}) {
  await db.insert(analyticsEvents).values({
    id: crypto.randomUUID(),
    userId: opts.userId,
    productId: opts.productId,
    eventType: "search",
    query: opts.query,
    entityType: opts.resultCount === 0 ? "no_results" : null,
    createdAt: Date.now(),
  });
}
