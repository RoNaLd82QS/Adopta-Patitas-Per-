// app/adopta/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Adopta | Adoptapatitas" };
// refresco liviano del caché
export const revalidate = 60;

function Hero() {
  return (
    <div className="relative w-full border-b bg-teal-600 text-white">
      <div
        className="mx-auto max-w-7xl px-6 py-12 md:py-20"
        style={{
          // mismo patrón de puntitos que mostraste
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0",
        }}
      >
        <p className="font-extrabold tracking-wider uppercase text-2xl md:text-4xl">
          Ayúdanos a ayudar
        </p>
        <h1 className="mt-2 font-extrabold tracking-tight text-5xl md:text-7xl">
          ADOPTA
        </h1>
      </div>
    </div>
  );
}

export default async function AdoptaPage() {
  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl p-6">
        {pets.length === 0 ? (
          <p className="text-slate-600">
            Aún no hay mascotas publicadas. Vuelve pronto. 🐾
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="aspect-[4/3] bg-slate-100">
                  <img
                    src={p.photoUrl ?? "/pet-placeholder.jpg"}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.name}</h3>

                  <p className="text-sm text-slate-600 mt-1">
                    {p.species === "DOG" ? "Perro" : "Gato"} ·{" "}
                    {p.sex === "MALE" ? "Macho" : "Hembra"}
                    {typeof p.ageMonths === "number" &&
                      ` · ${Math.floor(p.ageMonths / 12)}a ${
                        p.ageMonths % 12
                      }m`}
                  </p>

                  <Link
                    href={`/adopta/${p.id}`}
                    className="mt-3 inline-block rounded bg-amber-400 px-4 py-2 font-medium hover:bg-amber-500"
                  >
                    Adoptar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
