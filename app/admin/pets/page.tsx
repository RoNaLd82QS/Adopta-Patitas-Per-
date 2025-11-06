//app/admin/pets/page.tsx
import prisma from "@/lib/prisma";
import { createPet, deletePet } from "./actions";

export const metadata = { title: "Mascotas | Admin" };

export default async function AdminPetsPage() {
  const pets = await prisma.pet.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Mascotas</h1>

      {/* Crear */}
      <form
        action={createPet}
        encType="multipart/form-data"
        className="grid md:grid-cols-2 gap-4 rounded-xl border p-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input name="name" required className="w-full rounded border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Especie</label>
          <select name="species" className="w-full rounded border p-2">
            <option value="DOG">Perro</option>
            <option value="CAT">Gato</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sexo</label>
          <select name="sex" className="w-full rounded border p-2">
            <option value="MALE">Macho</option>
            <option value="FEMALE">Hembra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Edad (años)</label>
          <input
            type="number"
            name="ageYears"
            min={0}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            name="weightKg"
            className="w-full rounded border p-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Foto (JPG/PNG)
          </label>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            className="w-full rounded border p-2"
          />
        </div>

        <div className="md:col-span-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>

      {/* Lista */}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((p) => (
          <li key={p.id} className="rounded-xl border p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-slate-50">
              {/* usamos img simple */}
              <img
                src={p.photoUrl || "https://placehold.co/800x600?text=Mascota"}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-slate-600">
                {p.species === "DOG" ? "Perro" : "Gato"} ·{" "}
                {p.sex === "MALE" ? "Macho" : "Hembra"} · {p.ageMonths} meses
              </div>
              {p.description && <p className="mt-1 text-sm">{p.description}</p>}
            </div>

            {/* Eliminar (también es server action) */}
            <form action={deletePet} className="mt-3">
              <input type="hidden" name="id" value={p.id} />
              <button className="rounded border px-3 py-1.5 text-sm hover:bg-red-50 hover:text-red-700">
                Eliminar
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
