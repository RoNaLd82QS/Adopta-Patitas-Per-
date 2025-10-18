import { prisma } from "@/lib/prisma";
import {
  deleteFollowUp,
  updateFollowUp,
  addPhoto,
  deletePhoto,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function EditFollowUpPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.followUp.findUnique({
    where: { id: params.id },
    include: { pet: true, photos: { orderBy: { createdAt: "desc" } } },
  });
  if (!row) return <p>No encontrado.</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Seguimiento · {row.pet?.name}</h3>

        <form
          action={async () => {
            "use server";
            await deleteFollowUp(row.id);
          }}
        >
          <button className="rounded px-3 py-2 bg-red-600 text-white">
            Eliminar seguimiento
          </button>
        </form>
      </div>

      {/* Editar datos */}
      <form
        action={(form) => updateFollowUp(row.id, form)}
        className="space-y-3 border rounded p-3"
      >
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Adoptante</label>
            <input
              name="adopterName"
              defaultValue={row.adopterName ?? ""}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Fecha de creación
            </label>
            <input
              value={new Date(row.createdAt).toLocaleString()}
              readOnly
              className="border rounded w-full p-2 bg-gray-100"
            />
          </div>
        </div>

        <label className="block text-sm text-gray-700">Notas</label>
        <textarea
          name="notes"
          defaultValue={row.notes ?? ""}
          className="border rounded w-full p-2 min-h-28"
        />

        <button className="rounded px-3 py-2 bg-blue-600 text-white">
          Guardar cambios
        </button>
      </form>

      {/* Fotos */}
      <section className="space-y-3">
        <h4 className="font-semibold">Fotos</h4>

        {/* Agregar foto por URL */}
        <form action={addPhoto} className="flex gap-2">
          <input type="hidden" name="followUpId" value={row.id} />
          <input
            name="url"
            placeholder="https://… (URL de la foto)"
            className="border rounded w-full p-2"
          />
          <button className="rounded px-3 py-2 bg-gray-800 text-white">
            Agregar
          </button>
        </form>

        {/* Galería simple */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {row.photos.map((p) => (
            <div key={p.id} className="border rounded overflow-hidden">
              {/* Usa <img> para evitar configurar domains; si prefieres <Image>, añade el dominio en next.config.ts */}
              <img src={p.url} alt="" className="w-full h-40 object-cover" />
              <div className="p-2 flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await deletePhoto(p.id);
                  }}
                >
                  <button className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {row.photos.length === 0 && (
            <p className="text-gray-500">Aún no hay fotos.</p>
          )}
        </div>
      </section>
    </div>
  );
}
