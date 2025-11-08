//app/admin/certificados/new/page.tsx
import prisma from "@/lib/prisma";
import { createCertificate } from "../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

type Props = { searchParams?: { adoptionId?: string } };

export default async function NewCertificatePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return notFound();

  const adoptionId = searchParams?.adoptionId ?? "";
  const adoption = adoptionId
    ? await prisma.adoption.findUnique({
        where: { id: adoptionId },
        include: {
          pet: { select: { name: true, species: true } },
          user: { select: { name: true, email: true } },
        },
      })
    : null;

  return (
    <section className="max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Crear certificado</h2>

      {adoption ? (
        <div className="rounded border p-3 text-sm">
          <div>
            <b>Mascota:</b> {adoption.pet?.name} ({adoption.pet?.species})
          </div>
          <div>
            <b>Adoptante:</b>{" "}
            {adoption.adopterName ||
              adoption.user?.name ||
              adoption.adopterEmail}
          </div>
          <div>
            <b>Email:</b> {adoption.user?.email || adoption.adopterEmail}
          </div>
        </div>
      ) : (
        <div className="rounded border p-3 text-sm">
          Ingresa con parámetro <code>?adoptionId=</code> o agrega un input
          abajo.
        </div>
      )}

      <form
        action={createCertificate}
        className="grid gap-3 rounded border p-4"
      >
        <label className="text-sm font-medium">ID de adopción</label>
        <input
          name="adoptionId"
          defaultValue={adoptionId}
          className="border rounded p-2"
          required
        />

        <label className="text-sm font-medium">
          N° de certificado (opcional)
        </label>
        <input
          name="certificateNumber"
          placeholder="Ej. CERT-2025-000123"
          className="border rounded p-2"
        />

        <label className="text-sm font-medium">
          Imagen del libro (opcional)
        </label>
        <input type="file" name="bookImage" accept="image/*" />

        <label className="text-sm font-medium">Firma digital (opcional)</label>
        <input type="file" name="signature" accept="image/*" />

        <button className="rounded bg-emerald-600 px-4 py-2 text-white">
          Guardar y generar
        </button>
      </form>
    </section>
  );
}
