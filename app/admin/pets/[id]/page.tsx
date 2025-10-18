import prisma from "@/lib/prisma";
import { updatePet } from "../actions";

type Props = {
  params: { id: string };
};

export default async function EditPetPage({ params }: Props) {
  const pet = await prisma.pet.findUnique({
    where: { id: params.id },
  });

  if (!pet) return <p className="p-6">No encontrada</p>;

  return (
    <section className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Editar: {pet.name}</h1>

      {/* vista rápida */}
      {pet.photoUrl && (
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="h-40 w-auto rounded border object-cover"
        />
      )}

      <form
        action={updatePet.bind(null, pet.id)}
        encType="multipart/form-data"
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            name="name"
            defaultValue={pet.name}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Especie</label>
            <select
              name="species"
              defaultValue={pet.species}
              className="w-full rounded border p-2"
            >
              <option value="DOG">Perro</option>
              <option value="CAT">Gato</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Sexo</label>
            <select
              name="sex"
              defaultValue={pet.sex}
              className="w-full rounded border p-2"
            >
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Edad (meses)</label>
            <input
              name="ageMonths"
              type="number"
              min={0}
              defaultValue={pet.ageMonths ?? 0}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Peso (kg)</label>
            <input
              name="weightKg"
              type="number"
              step="0.1"
              defaultValue={pet.weightKg ?? ""}
              className="w-full rounded border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Foto (dejar en blanco para mantener)
          </label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={pet.description ?? ""}
            className="w-full rounded border p-2"
          />
        </div>

        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Guardar cambios
        </button>
      </form>
    </section>
  );
}
