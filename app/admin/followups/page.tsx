import { prisma } from "@/lib/prisma";
import {
  addFollowUpPhoto,
  createFollowUp,
  deleteFollowUp,
  deleteFollowUpPhoto,
} from "./actions";

export default async function AdminFollowUpsPage() {
  const [pets, followUps] = await Promise.all([
    prisma.pet.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.followUp.findMany({
      orderBy: { createdAt: "desc" },
      include: { pet: true, photos: true },
    }),
  ]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Seguimiento de adopciones</h2>

      <form
        action={createFollowUp}
        className="grid gap-3 rounded-xl border p-4 mb-6 bg-white"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Mascota</span>
            <select name="petId" className="rounded border px-3 py-2">
              <option value="">Selecciona...</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Adoptante</span>
            <input
              name="adopterName"
              className="rounded border px-3 py-2"
              placeholder="Nombre del adoptante"
            />
          </label>
          <label className="grid gap-1 sm:col-span-3">
            <span className="text-sm text-slate-600">Notas</span>
            <textarea
              name="notes"
              rows={3}
              className="rounded border px-3 py-2"
            />
          </label>
        </div>
        <button className="rounded bg-blue-600 text-white px-4 py-2 w-fit">
          Crear seguimiento
        </button>
      </form>

      {followUps.length === 0 ? (
        <p className="text-slate-500">No hay seguimientos.</p>
      ) : (
        <ul className="grid gap-4">
          {followUps.map((fu) => (
            <li key={fu.id} className="rounded-xl border p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">
                    {fu.pet.name} · {fu.adopterName}
                  </div>
                  <div className="text-sm text-slate-600">
                    {new Date(fu.createdAt).toLocaleString()}
                  </div>
                  {fu.notes && (
                    <p className="text-sm mt-2 whitespace-pre-wrap">
                      {fu.notes}
                    </p>
                  )}
                </div>
                <form action={async () => deleteFollowUp(fu.id)}>
                  <button className="rounded border px-3 py-1 hover:bg-red-50">
                    Eliminar
                  </button>
                </form>
              </div>

              <div className="mt-4">
                <div className="font-medium mb-2">Fotos</div>
                {fu.photos.length === 0 ? (
                  <p className="text-sm text-slate-500">Sin fotos aún.</p>
                ) : (
                  <ul className="flex gap-3 flex-wrap">
                    {fu.photos.map((ph) => (
                      <li key={ph.id} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.url}
                          alt=""
                          className="w-32 h-32 object-cover rounded border"
                        />
                        <form action={async () => deleteFollowUpPhoto(ph.id)}>
                          <button className="absolute top-1 right-1 rounded bg-white/90 border px-2 py-0.5 text-xs">
                            X
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <form action={addFollowUpPhoto} className="mt-3 flex gap-2">
                  <input type="hidden" name="followUpId" value={fu.id} />
                  <input
                    name="url"
                    className="rounded border px-3 py-2 flex-1"
                    placeholder="URL de la foto ..."
                  />
                  <button className="rounded border px-3 py-2">
                    Agregar foto
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
