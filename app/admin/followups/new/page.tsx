import { prisma } from "@/lib/prisma";
import { createFollowUp } from "../actions";

export default async function NewFollowUpPage() {
  const pets = await prisma.pet.findMany({
    orderBy: [{ species: "asc" }, { name: "asc" }],
    select: { id: true, name: true, species: true },
  });

  return (
    <form action={createFollowUp} className="max-w-xl space-y-3">
      <h3 className="text-lg font-semibold mb-2">Nuevo seguimiento</h3>

      <label className="block text-sm text-gray-700">Mascota</label>
      <select name="petId" className="border rounded w-full p-2" required>
        <option value="" disabled selected>
          Selecciona una mascota…
        </option>
        {pets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.species})
          </option>
        ))}
      </select>

      <input
        name="adopterName"
        placeholder="Nombre del adoptante"
        className="border rounded w-full p-2"
        required
      />
      <textarea
        name="notes"
        placeholder="Notas (opcional)"
        className="border rounded w-full p-2 min-h-28"
      />

      <button className="rounded px-3 py-2 bg-green-600 text-white">
        Guardar
      </button>
    </form>
  );
}
