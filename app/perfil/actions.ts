"use server";

import { revalidatePath } from "next/cache";
import { destroyAllSessions, destroyOtherSession, requireUser } from "@/lib/boost-engine/services/auth";

export async function disconnectDeviceAction(formData: FormData) {
  const deviceId = formData.get("deviceId");
  if (typeof deviceId !== "string") return;

  const user = await requireUser();
  await destroyOtherSession(user.id, deviceId);
  revalidatePath("/perfil");
}

export async function disconnectAllDevicesAction() {
  const user = await requireUser();
  await destroyAllSessions(user.id);
  revalidatePath("/perfil");
  // a sessão atual também foi removida — o próximo requireUser() manda para /login
}
