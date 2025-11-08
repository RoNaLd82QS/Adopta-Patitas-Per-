// app/admin/followups/page.tsx
import prisma from "@/lib/prisma";
import { createFollowUp, deleteFollowUp } from "./actions";

export const metadata = { title: "Seguimientos | Admin" };

export default async function AdminFollowUpsPage() {
  const [pets, rows] = await Promise.all([
    prisma.pet.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    prisma.followUp.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        pet: { select: { name: true } },
        _count: { select: { photos: true } },
      },
    }),
  ]);

  return (
    <section className="mx-auto max-w-5xl p-6 space-y-8">
      <h1 className="text-3xl font-bold">Seguimiento post-adopción</h1>

      {/* Tabla */}
      <div className="rounded border divide-y bg-white">
        {rows.map((r) => (
          <div
            key={r.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div>
              <div className="font-medium">{r.pet.name}</div>
              <div className="text-sm text-slate-600">
                Adoptante: {r.adopterName} · Fotos: {r._count.photos}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/admin/followups/${r.id}`}
                className="rounded bg-slate-700 text-white px-3 py-2"
              >
                Ver
              </a>

              <form action={deleteFollowUp}>
                <input type="hidden" name="id" value={r.id} />
                <button className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="p-6 text-slate-600">Aún no hay seguimientos.</div>
        )}
      </div>
    </section>
  );
}
