import Link from "next/link";
import type { Animal } from "@/lib/types";
import { edadHumana } from "@/data/animals";

export default function AnimalCard({ a }: { a: Animal }) {
  const foto =
    a.fotos?.[0] ?? "https://placehold.co/800x520?text=Adoptapatitas";
  return (
    <article className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
      <img
        src={foto}
        alt={a.nombre}
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">{a.nombre}</h3>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-1">
            {a.especie}
          </span>
          <span className="rounded-full bg-pink-50 text-pink-700 px-2 py-1">
            {a.sexo}
          </span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">
            {edadHumana(a.edadMeses)}
          </span>
          <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-1">
            {a.tamanio}
          </span>
        </div>

        <p className="text-sm text-slate-600">{a.historia}</p>

        <div className="pt-1">
          <Link
            href={`/adopta/${a.slug}`}
            className="inline-block rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
          >
            Quiero adoptar
          </Link>
        </div>
      </div>
    </article>
  );
}
