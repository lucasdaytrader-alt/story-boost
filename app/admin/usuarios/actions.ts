"use server";

import { revalidatePath } from "next/cache";
import { eq, ne, and } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import { users, entitlements, products, favorites } from "@/lib/boost-engine/db/schema";
import { requireAdmin, hashPassword, destroyAllSessions } from "@/lib/boost-engine/services/auth";

export type UserActionState =
  | { error: string; success?: undefined; email?: undefined; password?: undefined }
  | { success: true; error?: undefined; email: string; password: string }
  | null;

export async function createUserAction(
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const plan = String(formData.get("plan") ?? "").trim();

  if (!name || !email || !plan) {
    return { error: "Preencha nome, e-mail e plano." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const userId = crypto.randomUUID();
  const now = Date.now();

  await db.insert(users).values({
    id: userId,
    email,
    name,
    authProvider: "email",
    passwordHash: hashPassword(password),
    isAdmin: false,
    plan,
    createdAt: now,
  });

  const [product] = await db.select().from(products).where(eq(products.slug, "story-boost"));
  if (product) {
    await db.insert(entitlements).values({
      id: crypto.randomUUID(),
      userId,
      productId: product.id,
      status: "active",
      source: "manual",
      grantedAt: now,
    });
  }

  revalidatePath("/admin/usuarios");

  return { success: true, email, password };
}

export type SimpleUserActionState = { error?: string; success?: boolean } | null;

export async function updateUserAction(
  _prevState: SimpleUserActionState,
  formData: FormData
): Promise<SimpleUserActionState> {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const plan = String(formData.get("plan") ?? "").trim();

  if (!userId || !name || !email || !plan) {
    return { error: "Preencha nome, e-mail e plano." };
  }

  const [emailTaken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, userId)));
  if (emailTaken) {
    return { error: "Já existe outra conta com este e-mail." };
  }

  await db.update(users).set({ name, email, plan }).where(eq(users.id, userId));

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function resetPasswordAction(
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return { error: "Usuário não encontrado." };

  const newPassword = crypto.randomUUID().slice(0, 8);
  await db.update(users).set({ passwordHash: hashPassword(newPassword) }).where(eq(users.id, userId));

  // Encerra sessões ativas: a senha antiga não deve continuar valendo em nenhum aparelho.
  await destroyAllSessions(userId);

  revalidatePath("/admin/usuarios");
  return { success: true, email: user.email, password: newPassword };
}

export async function deleteUserAction(
  _prevState: SimpleUserActionState,
  formData: FormData
): Promise<SimpleUserActionState> {
  const admin = await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  if (!userId) return { error: "Usuário inválido." };
  if (userId === admin.id) return { error: "Você não pode excluir sua própria conta." };

  await destroyAllSessions(userId);
  await db.delete(favorites).where(eq(favorites.userId, userId));
  await db.delete(entitlements).where(eq(entitlements.userId, userId));
  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/admin/usuarios");
  return { success: true };
}
