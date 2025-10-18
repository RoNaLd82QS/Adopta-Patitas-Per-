import prisma from "@/lib/prisma";
import { createEvent, deleteEvent, togglePublish } from "./actions";

export const metadata = { title: "Eventos | Admin" };

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-8">Eventos</h1>

      {/* FORMULARIO CREAR */}
      <form
        action={createEvent}
        encType="multipart/form-data"
        className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border p-5"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            name="title"
            required
            className="w-full rounded border p-2"
            placeholder="Campaña de esterilización"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            name="date"
            type="date"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lugar</label>
          <input
            name="location"
            className="w-full rounded border p-2"
            placeholder="Parque Central"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded border p-2"
            placeholder="Detalles del evento..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Banner (JPG/PNG)
          </label>
          <input
            name="banner"
            type="file"
            accept=".jpg,.jpeg,.png"
            className="w-full rounded border p-2"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          >
            Guardar evento
          </button>
        </div>
      </form>

      {/* LISTA */}
      <ul className="space-y-4">
        {events.map((e) => (
          <li key={e.id} className="rounded-2xl border p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {e.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.bannerUrl}
                  alt=""
                  className="h-32 w-48 object-cover rounded-lg"
                />
              ) : (
                <div className="h-32 w-48 rounded-lg bg-slate-200" />
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p className="text-sm text-slate-600">{formatDate(e.date)}</p>
                {e.location && (
                  <p className="text-sm text-slate-600">Lugar: {e.location}</p>
                )}
                {e.description && (
                  <p className="mt-1 text-sm text-slate-700 line-clamp-2">
                    {e.description}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <form action={togglePublish.bind(null, e.id, !e.published)}>
                  <button
                    className={`rounded px-3 py-2 text-sm font-medium ${
                      e.published
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {e.published ? "Ocultar" : "Publicar"}
                  </button>
                </form>

                <form action={deleteEvent.bind(null, e.id)}>
                  <button className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
