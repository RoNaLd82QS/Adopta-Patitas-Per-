//app/perfil/seguimientos/[id]/page.tsx
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { addMyFollowUpPhotos } from "../actions";

type Params = { id: string };

export default async function FollowUpMyDetail({ params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("No autorizado");

  const row = await prisma.followUp.findUnique({
    where: { id: params.id },
    include: {
      pet: true,
      photos: { orderBy: { createdAt: "desc" } },
      adoption: { select: { adopterEmail: true } },
    },
  });
  if (!row || row.adoption?.adopterEmail !== email) return notFound();

  return (
    <section className="mx-auto max-w-4xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Seguimiento de {row.pet.name} (mío)
      </h1>

      <div className="rounded border p-4">
        <div className="text-sm text-slate-600">
          Creado: {new Date(row.createdAt).toLocaleString()}
        </div>
        {row.notes ? <p className="mt-2">{row.notes}</p> : null}
      </div>

      <form
        action={(fd) => addMyFollowUpPhotos(row.id, fd)}
        className="rounded border p-4 grid gap-3"
      >
        <h3 className="text-lg font-semibold">Agregar fotos</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <input type="file" name="photo0" accept="image/*" />
          <input type="file" name="photo1" accept="image/*" />
          <input type="file" name="photo2" accept="image/*" />
        </div>
        <button className="rounded bg-emerald-600 px-4 py-2 text-white">
          Subir
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Fotos</h3>
        {row.photos.length === 0 ? (
          <p className="text-slate-600">Sin fotos.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {row.photos.map((p) => (
              <li key={p.id} className="rounded border overflow-hidden">
                <img src={p.url} alt="" className="h-48 w-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
