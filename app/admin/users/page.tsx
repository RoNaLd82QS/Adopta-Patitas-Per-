// app/admin/users/page.tsx
import prisma from "@/lib/prisma";
import type { Role } from "@prisma/client";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  profile: {
    name: string | null;
    dni: string | null;
    address: string | null;
    district: string | null;
    province: string | null;
  } | null;
  adoptionsCount: number;
};

async function getUsers(): Promise<UserRow[]> {
  // 1) Trae solo los campos que vas a usar
  const base = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profile: {
        select: {
          name: true,
          dni: true,
          address: true,
          district: true,
          province: true,
        },
      },
    },
  });

  // 2) Calcula el total de solicitudes por usuario (sin _count)
  const rows = await Promise.all(
    base.map(async (u) => ({
      ...u,
      adoptionsCount: await prisma.adoption.count({ where: { id: u.id } }),
    }))
  );

  return rows;
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <section className="mx-auto max-w-6xl">
      <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">DNI</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Solicitudes</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.profile?.name ?? u.name ?? "—"}</td>
                <td className="p-3">{u.profile?.dni ?? "—"}</td>
                <td className="p-3">
                  {[
                    u.profile?.address,
                    u.profile?.district,
                    u.profile?.province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="p-3">{u.adoptionsCount}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <a
                    href={`/admin/solicitudes?email=${encodeURIComponent(
                      u.email
                    )}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver solicitudes
                  </a>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={7}>
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
