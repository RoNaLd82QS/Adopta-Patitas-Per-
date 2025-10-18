import { createPet } from "../actions";

export default function NewPetPage() {
  return (
    <section className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nueva mascota</h1>

      <form
        action={createPet}
        encType="multipart/form-data"
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input name="name" required className="w-full rounded border p-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Especie</label>
            <select name="species" className="w-full rounded border p-2">
              <option value="DOG">Perro</option>
              <option value="CAT">Gato</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Sexo</label>
            <select name="sex" className="w-full rounded border p-2">
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
              className="w-full rounded border p-2"
              defaultValue={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Peso (kg)</label>
            <input
              name="weightKg"
              type="number"
              step="0.1"
              className="w-full rounded border p-2"
              placeholder="ej. 5.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Foto</label>
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
            className="w-full rounded border p-2"
            placeholder="carácter, cuidados, etc."
          />
        </div>

        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Guardar
        </button>
      </form>
    </section>
  );
}
