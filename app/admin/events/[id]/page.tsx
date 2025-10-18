import prisma from "@/lib/prisma";
import { deleteEvent, togglePublish, updateEvent } from "../actions";

function toLocalInputValue(date: Date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.event.findUnique({ where: { id: params.id } });
  if (!row) return <p>No encontrado</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h3 className="text-lg font-semibold">Editar evento</h3>

      {/* UPDATE (no anidar otros forms aquí) */}
      <form
        action={updateEvent.bind(null, row.id)}
        className="space-y-3"
        encType="multipart/form-data"
      >
        <input
          name="title"
          defaultValue={row.title}
          required
          className="border rounded w-full p-2"
        />
        <input
          type="datetime-local"
          name="date"
          defaultValue={toLocalInputValue(row.date)}
          required
          className="border rounded w-full p-2"
        />
        <input
          name="location"
          defaultValue={row.location ?? ""}
          className="border rounded w-full p-2"
        />
        <textarea
          name="description"
          defaultValue={row.description ?? ""}
          className="border rounded w-full p-2 min-h-28"
        />

        {/* usa file si en actions lees `banner` */}
        <input
          type="file"
          name="banner"
          accept="image/*"
          className="border rounded w-full p-2"
        />

        <button className="rounded px-3 py-2 bg-blue-600 text-white">
          Guardar
        </button>
      </form>

      {/* Acciones separadas (no anidadas) */}
      <div className="flex gap-2">
        <form action={togglePublish.bind(null, row.id, !row.published)}>
          <button className="rounded px-3 py-2 bg-gray-700 text-white">
            {row.published ? "Pasar a borrador" : "Publicar"}
          </button>
        </form>

        <form action={deleteEvent.bind(null, row.id)}>
          <button className="rounded px-3 py-2 bg-red-600 text-white">
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}
