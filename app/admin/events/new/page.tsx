import { createEvent } from "../actions";

export default function NewEventPage() {
  const todayLocal = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  })();

  return (
    <form action={createEvent} className="max-w-xl space-y-3">
      <h3 className="text-lg font-semibold mb-2">Nuevo evento</h3>

      <input
        name="title"
        placeholder="Título"
        className="border rounded w-full p-2"
        required
      />
      <input
        type="datetime-local"
        name="date"
        defaultValue={todayLocal}
        className="border rounded w-full p-2"
        required
      />
      <input
        name="location"
        placeholder="Lugar (opcional)"
        className="border rounded w-full p-2"
      />
      <textarea
        name="description"
        placeholder="Descripción (opcional)"
        className="border rounded w-full p-2 min-h-28"
      />
      <input
        name="bannerUrl"
        placeholder="URL del banner (opcional)"
        className="border rounded w-full p-2"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked />
        Publicar
      </label>

      <button className="rounded px-3 py-2 bg-green-600 text-white">
        Guardar
      </button>
    </form>
  );
}
