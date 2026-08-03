import { getUserDevices, requireUser } from "@/lib/boost-engine/services/auth";
import { signOutAction } from "@/app/login/actions";
import { disconnectAllDevicesAction, disconnectDeviceAction } from "./actions";
import { Header } from "@/components/story-boost/Header";
import { BottomNav } from "@/components/story-boost/BottomNav";
import { Badge } from "@/components/ui/Badge";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";

// Página autenticada com dados por usuário — nunca deve ser prerenderizada
// estaticamente no build (precisa da sessão/cookie de cada request).
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export default async function PerfilPage() {
  const user = await requireUser();
  const userDevices = await getUserDevices(user.id);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper">
      <Header userName={user.name} isAdmin={user.isAdmin} />

      <div className="flex flex-col items-center gap-2 px-4 pb-2 pt-4">
        <span className="shadow-elevation-1 grid h-16 w-16 place-items-center rounded-full bg-ink text-lg font-semibold text-white">
          {initials(user.name)}
        </span>
        <p className="font-display text-xl font-bold text-ink">{user.name}</p>
        <p className="text-sm text-muted">{user.email}</p>
        {user.isAdmin && <Badge variant="price">Administrador</Badge>}
      </div>

      <div className="mt-4 px-4 pb-28">
        <div className="shadow-elevation-1 mb-6 rounded-2xl border border-line p-4">
          <p className="mb-1 text-sm font-semibold text-ink">Acesso</p>
          <p className="text-sm text-muted">Catálogo principal ativo.</p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[16px] font-bold text-ink">
            Meus dispositivos ({userDevices.length}/2)
          </h2>
          {userDevices.length > 0 && (
            <form action={disconnectAllDevicesAction}>
              <button
                type="submit"
                className="focus-ring rounded text-[12px] font-semibold text-flame transition-colors hover:text-flame/80"
              >
                Desconectar todos
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {userDevices.map((d) => (
            <div
              key={d.id}
              className="transition-premium flex items-center justify-between rounded-2xl border border-line px-4 py-3 hover:border-ink/15"
            >
              <div>
                <p className="text-sm font-medium text-ink">
                  {d.deviceModel} {d.isCurrent && <span className="text-flame">· este aparelho</span>}
                </p>
                <p className="text-[12px] text-muted">
                  {d.os} · último acesso {new Date(d.lastAccessAt).toLocaleDateString("pt-BR")}
                  {d.approxLocation ? ` · ${d.approxLocation}` : ""}
                </p>
              </div>
              {!d.isCurrent && (
                <form action={disconnectDeviceAction}>
                  <input type="hidden" name="deviceId" value={d.id} />
                  <button
                    type="submit"
                    className="focus-ring rounded text-[12px] font-semibold text-muted transition-colors hover:text-flame"
                  >
                    Desconectar
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        <form action={signOutAction} className="mt-8">
          <FormSubmitButton variant="outline" fullWidth pendingLabel="Saindo...">
            Sair da conta
          </FormSubmitButton>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
