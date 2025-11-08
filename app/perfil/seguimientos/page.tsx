//app/perfil/seguimientos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createMyFollowUp, deleteMyFollowUp } from "./actions";

export const metadata = { title: "Mis seguimientos" };

export default async function MisSeguimientosPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("No autorizado");

  // Adopciones del usuario (para poblar el select)
  const myAdoptions = await prisma.adoption.findMany({
    where: { adopterEmail: email },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      pet: { select: { id: true, name: true, species: true } },
    },
  });

  // Seguimientos del usuario
  const myFollowUps = await prisma.followUp.findMany({
    where: { adoption: { adopterEmail: email } },
    orderBy: { createdAt: "desc" },
    include: {
      pet: { select: { name: true } },
      _count: { select: { photos: true } },
    },
  });

  return (
    <section className="mx-auto max-w-5xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Mis seguimientos</h1>

      <form action={createMyFollowUp} className="rounded border p-4 grid gap-3">
        <h3 className="text-lg font-semibold">Crear nuevo seguimiento</h3>

        <label className="text-sm">Mascota (de mis adopciones)</label>
        <select name="petId" className="border rounded p-2" required>
          <option value="">— Selecciona —</option>
          {myAdoptions.map((a) => (
            <option key={a.id} value={a.pet.id}>
              {a.pet.name} ({a.pet.species})
            </option>
          ))}
        </select>

        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          className="border rounded p-2 min-h-28"
        />

        <div className="grid md:grid-cols-3 gap-3">
          <input type="file" name="photo0" accept="image/*" />
          <input type="file" name="photo1" accept="image/*" />
          <input type="file" name="photo2" accept="image/*" />
        </div>

        <button className="rounded bg-emerald-600 px-4 py-2 text-white">
          Guardar
        </button>
      </form>

      <div className="rounded border divide-y bg-white">
        {myFollowUps.map((r) => (
          <div
            key={r.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div>
              <div className="font-medium">{r.pet.name}</div>
              <div className="text-sm text-slate-600">
                Fotos: {r._count.photos} ·{" "}
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/perfil/seguimientos/${r.id}`}
                className="rounded bg-slate-700 text-white px-3 py-2"
              >
                Ver
              </a>

              <form action={deleteMyFollowUp}>
                <input type="hidden" name="id" value={r.id} />
                <button className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}

        {myFollowUps.length === 0 && (
          <div className="p-6 text-slate-600">
            Aún no has enviado seguimientos.
          </div>
        )}
      </div>
    </section>
  );
}
