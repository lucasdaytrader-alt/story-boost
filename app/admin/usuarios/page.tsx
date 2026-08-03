import { db } from "@/lib/boost-engine/db/client";
import { users } from "@/lib/boost-engine/db/schema";
import { desc } from "drizzle-orm";
import { NewUserForm } from "./NewUserForm";
import { UserRow } from "./UserRow";

export default async function AdminUsuariosPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.plan,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Gerenciar usuários</h1>
      <p className="mb-6 text-sm text-muted">
        Crie a conta do cliente depois do pagamento e envie as credenciais pelo WhatsApp.
      </p>

      <div className="mb-6 rounded-2xl border border-line bg-paper p-4">
        <NewUserForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-2.5 font-medium">Nome</th>
              <th className="px-4 py-2.5 font-medium">E-mail</th>
              <th className="px-4 py-2.5 font-medium">Plano</th>
              <th className="px-4 py-2.5 font-medium">Data de criação</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
