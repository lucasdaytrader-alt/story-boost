"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/boost-engine/db/client";
import { entitlements, products, users } from "@/lib/boost-engine/db/schema";
import {
  createSession,
  destroySession,
  findUserByEmail,
  hashPassword,
  verifyPassword,
} from "@/lib/boost-engine/services/auth";

async function detectDevice() {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  let os = "Desconhecido";
  if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";

  const deviceModel = /mobile/i.test(ua) ? "Dispositivo móvel" : "Computador";
  return { deviceModel, os };
}

export type AuthActionState = { error?: string } | null;

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha incorretos." };
  }

  const device = await detectDevice();
  const result = await createSession(user.id, device);

  if (!result.ok) {
    return {
      error:
        "Você atingiu o limite de 2 dispositivos conectados. Entre em um dos aparelhos já conectados e desconecte um em Perfil > Meus dispositivos para continuar.",
    };
  }

  redirect("/");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 6) {
    return { error: "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres." };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const userId = crypto.randomUUID();
  await db.insert(users).values({
    id: userId,
    email,
    name,
    authProvider: "email",
    passwordHash: hashPassword(password),
    isAdmin: false,
    createdAt: Date.now(),
  });

  // ADR-003: sem gateway de pagamento ainda — todo novo cadastro recebe
  // acesso ativo ao catálogo principal por padrão (entitlement "stub").
  const [product] = await db.select().from(products).where(eq(products.slug, "story-boost"));
  if (product) {
    await db.insert(entitlements).values({
      id: crypto.randomUUID(),
      userId,
      productId: product.id,
      status: "active",
      source: "stub",
      grantedAt: Date.now(),
    });
  }

  const device = await detectDevice();
  const result = await createSession(userId, device);
  if (!result.ok) {
    return { error: "Conta criada, mas houve um problema ao iniciar a sessão. Tente entrar novamente." };
  }

  redirect("/");
}

export async function signOutAction() {
  await destroySession();
  redirect("/login");
}
