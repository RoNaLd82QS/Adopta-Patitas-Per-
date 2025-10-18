// app/adopta/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Params = { slug: string }; // usamos slug como ID del Pet

export async function generateMetadata({ params }: { params: Params }) {
  const pet = await prisma.pet.findUnique({ where: { id: params.slug } });
  return { title: pet ? `${pet.name} | Adopta` : "Adopta" };
}

export default async function PetDetailPage({ params }: { params: Params }) {
  const pet = await prisma.pet.findUnique({ where: { id: params.slug } });
  if (!pet) return notFound();

  return (
    <section className="mx-auto max-w-4xl p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden border bg-white">
          <img
            src={pet.photoUrl ?? "/pet-placeholder.jpg"}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{pet.name}</h1>
          <p className="text-slate-600 mt-2">
            {pet.species === "DOG" ? "Perro" : "Gato"} ·{" "}
            {pet.sex === "MALE" ? "Macho" : "Hembra"}
            {typeof pet.ageMonths === "number" &&
              ` · ${Math.floor(pet.ageMonths / 12)}a ${pet.ageMonths % 12}m`}
            {pet.weightKg ? ` · ${pet.weightKg} kg` : ""}
          </p>

          {pet.description && (
            <p className="mt-4 whitespace-pre-line">{pet.description}</p>
          )}

          <div className="mt-6 flex gap-3">
            {/* Aquí enlazas a tu flujo de postulación/contacto */}
            <Link
              href="/como-adoptar"
              className="rounded bg-amber-400 px-4 py-2 font-medium hover:bg-amber-500"
            >
              Quiero adoptar
            </Link>
            <Link
              href="/adopta"
              className="rounded border px-4 py-2 hover:bg-slate-50"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
