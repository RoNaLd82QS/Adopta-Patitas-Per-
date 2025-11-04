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

      {/* Crear seguimiento */}
      <form action={createFollowUp} className="rounded border p-4 grid gap-3">
        <h3 className="text-lg font-semibold">Nuevo seguimiento</h3>

        <select name="petId" className="border rounded p-2" required>
          <option value="">— Mascota —</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          name="adopterName"
          placeholder="Nombre del adoptante"
          className="border rounded p-2"
          required
        />

        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          className="border rounded p-2 min-h-28"
        />

        {/* Sube hasta 3 por defecto (puedes duplicar más) */}
        <div className="grid md:grid-cols-3 gap-3">
          <input type="file" name="photo0" accept="image/*" />
          <input type="file" name="photo1" accept="image/*" />
          <input type="file" name="photo2" accept="image/*" />
        </div>

        <button className="mt-2 rounded bg-emerald-600 px-4 py-2 text-white">
          Guardar
        </button>
      </form>

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
                Ver / Editar
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
