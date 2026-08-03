/**
 * Boost Engine — Serviço de autenticação
 *
 * Sessão baseada em cookie httpOnly + token opaco, validado contra a tabela
 * `devices` (que já modelava dispositivos conectados — reaproveitada como
 * armazenamento de sessão, evitando criar uma tabela nova para o mesmo
 * conceito). Limite de 2 dispositivos simultâneos por conta (regra da Fase 2).
 *
 * Hash de senha via scrypt nativo do Node — sem dependência externa.
 */

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../db/client";
import { devices, users } from "../db/schema";
export { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "sb_session";
const MAX_DEVICES = 2;

/**
 * Cria uma sessão (dispositivo) para o usuário. Se o limite de dispositivos
 * simultâneos já foi atingido, retorna um erro em vez de criar a sessão —
 * o usuário precisa desconectar um dispositivo existente primeiro.
 */
export async function createSession(
  userId: string,
  deviceInfo: { deviceModel: string; os: string }
): Promise<{ ok: true } | { ok: false; error: "device_limit" }> {
  const activeDevices = await db.select().from(devices).where(eq(devices.userId, userId));

  if (activeDevices.length >= MAX_DEVICES) {
    return { ok: false, error: "device_limit" };
  }

  const token = randomBytes(32).toString("hex");
  const now = Date.now();

  await db.insert(devices).values({
    id: crypto.randomUUID(),
    userId,
    sessionToken: token,
    deviceModel: deviceInfo.deviceModel,
    os: deviceInfo.os,
    lastAccessAt: now,
    createdAt: now,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 dias
  });

  return { ok: true };
}

/** Retorna o usuário da sessão atual, ou null se não houver sessão válida. */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isAdmin: users.isAdmin,
    })
    .from(devices)
    .innerJoin(users, eq(devices.userId, users.id))
    .where(eq(devices.sessionToken, token));

  return row ?? null;
}

/** Usa em Server Components de páginas protegidas: redireciona se não logado. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Usa em páginas do painel administrativo. */
export async function requireAdmin() {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(devices).where(eq(devices.sessionToken, token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function destroyAllSessions(userId: string) {
  await db.delete(devices).where(eq(devices.userId, userId));
}

export async function destroyOtherSession(userId: string, deviceId: string) {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(SESSION_COOKIE)?.value;

  await db
    .delete(devices)
    .where(
      and(
        eq(devices.userId, userId),
        eq(devices.id, deviceId),
        currentToken ? ne(devices.sessionToken, currentToken) : undefined
      )
    );
}

export async function getUserDevices(userId: string) {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(SESSION_COOKIE)?.value;

  const rows = await db.select().from(devices).where(eq(devices.userId, userId));
  return rows.map((d) => ({ ...d, isCurrent: d.sessionToken === currentToken }));
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}
