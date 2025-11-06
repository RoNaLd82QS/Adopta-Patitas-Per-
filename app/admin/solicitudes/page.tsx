// app/admin/solicitudes/page.tsx
// app/admin/solicitudes/page.tsx
import prisma from "@/lib/prisma";
import { aprobarSolicitud, rechazarSolicitud } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

type Row = Prisma.AdoptionGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } };
    pet: { select: { id: true; name: true; species: true } };
  };
}>;

// 👇 Nota: en Next 15, searchParams es Promise<...>
type Props = {
  searchParams: Promise<{ email?: string }>;
};

async function getData(email?: string): Promise<Row[]> {
  return prisma.adoption.findMany({
    where: email ? { adopterEmail: email } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      pet: { select: { id: true, name: true, species: true } },
    },
  });
}

export default async function SolicitudesAdminPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  // 👇 Espera los params antes de usarlos
  const { email } = await searchParams;

  const solicitudes = await getData(email);

  return (
    <section className="mx-auto max-w-6xl">
      <h2 className="text-xl font-semibold mb-4">Solicitudes de adopción</h2>

      {email && (
        <p className="mb-3 text-sm text-slate-600">
          Filtrado por: <b>{email}</b>
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Mascota</th>
              <th className="p-3 text-left">Adoptante</th>
              <th className="p-3 text-left">Contacto</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Motivación</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id} className="border-t align-top">
                <td className="p-3">
                  {new Date(s.createdAt).toLocaleString()}
                </td>

                <td className="p-3">
                  <div className="font-medium">{s.pet?.name ?? "—"}</div>
                  <div className="text-xs text-slate-500">{s.pet?.species}</div>
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {s.adopterName || s.user?.name || "—"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.user?.email || s.adopterEmail}
                  </div>
                </td>

                <td className="p-3">{s.adopterPhone ?? "—"}</td>

                <td className="p-3">
                  {[s.address, s.district, s.province]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>

                <td className="p-3 max-w-[260px]">
                  <div className="line-clamp-3">{s.motivation ?? "—"}</div>
                </td>

                <td className="p-3">
                  <span
                    className={
                      "rounded px-2 py-1 text-xs " +
                      (s.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : s.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-rose-100 text-rose-800")
                    }
                  >
                    {s.status}
                  </span>
                </td>

                <td className="p-3">
                  {s.status === "PENDING" ? (
                    <div className="flex gap-2">
                      {/* 👇 Pasa la server action con bind */}
                      <form action={aprobarSolicitud.bind(null, s.id)}>
                        <button
                          className="rounded-lg border px-3 py-1 hover:bg-green-50"
                          type="submit"
                        >
                          Aprobar
                        </button>
                      </form>
                      <form action={rechazarSolicitud.bind(null, s.id)}>
                        <button
                          className="rounded-lg border px-3 py-1 hover:bg-rose-50"
                          type="submit"
                        >
                          Rechazar
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}

            {solicitudes.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={8}>
                  No hay solicitudes por ahora.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
