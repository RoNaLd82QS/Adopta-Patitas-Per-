// app/admin/followups/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  addFollowUpPhotos,
  deleteFollowUp,
  deletePhoto,
  updateFollowUp,
} from "../actions";

type Params = { id: string };

export default async function FollowUpDetail({ params }: { params: Params }) {
  const row = await prisma.followUp.findUnique({
    where: { id: params.id },
    include: { pet: true, photos: { orderBy: { createdAt: "desc" } } },
  });
  if (!row) return notFound();

  // ✅ Enlaza las Server Actions con el id (bound actions)
  const updateAction = updateFollowUp.bind(null, row.id);
  const addPhotosAction = addFollowUpPhotos.bind(null, row.id);

  return (
    <section className="mx-auto max-w-4xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Seguimiento de {row.pet.name}</h1>

      {/* Editar cabecera */}
      <form action={updateAction} className="rounded border p-4 grid gap-3">
        <label className="text-sm font-medium">Adoptante</label>
        <input
          name="adopterName"
          defaultValue={row.adopterName}
          className="border rounded p-2"
          required
        />

        <label className="text-sm font-medium">Notas</label>
        <textarea
          name="notes"
          defaultValue={row.notes ?? ""}
          className="border rounded p-2 min-h-28"
        />

        <div className="flex gap-3">
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            Guardar cambios
          </button>
        </div>
      </form>

      {/* Eliminar seguimiento (form separado, no anidado) */}
      <form action={deleteFollowUp} className="border rounded p-4">
        <input type="hidden" name="id" value={row.id} />
        <button className="text-red-600 hover:underline">
          Eliminar seguimiento
        </button>
      </form>

      {/* Subir nuevas fotos */}
      <form action={addPhotosAction} className="rounded border p-4 grid gap-3">
        <h3 className="text-lg font-semibold">Agregar fotos</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <input type="file" name="photo0" accept="image/*" />
          <input type="file" name="photo1" accept="image/*" />
          <input type="file" name="photo2" accept="image/*" />
        </div>
        <button className="rounded bg-emerald-600 px-4 py-2 text-white">
          Subir
        </button>
      </form>

      {/* Galería con eliminar */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Fotos</h3>
        {row.photos.length === 0 ? (
          <p className="text-slate-600">Sin fotos.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {row.photos.map((p) => (
              <li key={p.id} className="rounded border overflow-hidden">
                <img src={p.url} alt="" className="h-48 w-full object-cover" />
                <div className="p-2 border-t">
                  <form action={deletePhoto} className="text-right">
                    <input type="hidden" name="photoId" value={p.id} />
                    <input type="hidden" name="followUpId" value={row.id} />
                    <button className="text-red-600 hover:underline text-sm">
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
