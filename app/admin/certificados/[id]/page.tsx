// app/admin/certificados/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = { id: string };

export default async function CertDetail({ params }: { params: Params }) {
  const cert = await prisma.adoptionCertificate.findUnique({
    where: { id: params.id },
    include: {
      adoption: {
        include: {
          pet: { select: { name: true, species: true } },
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!cert) return notFound();

  const a = cert.adoption!;
  const adopter = a.adopterName || a.user?.name || a.adopterEmail;

  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="text-xl font-semibold">Certificado de adopción</h2>

      <div className="rounded border p-4">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <b>N° Certificado:</b> {cert.certificateNumber}
          </div>
          <div>
            <b>Emitido:</b> {new Date(cert.issuedAt).toLocaleString()}
          </div>
          <div>
            <b>Mascota:</b> {a.pet?.name} ({a.pet?.species})
          </div>
          <div>
            <b>Adoptante:</b> {adopter}
          </div>
          <div>
            <b>Correo:</b> {a.user?.email || a.adopterEmail}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <a
            className="rounded bg-slate-800 text-white px-3 py-2"
            href={`/admin/certificados/${cert.id}/pdf`}
          >
            Descargar PDF
          </a>
          <a
            className="rounded border px-3 py-2"
            href={`/admin/certificados/new?adoptionId=${a.id}`}
          >
            Reemplazar/Actualizar
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cert.bookImageUrl ? (
          <div className="rounded border p-3">
            <div className="text-sm mb-2">Imagen del libro</div>
            <img
              src={cert.bookImageUrl}
              alt="Imagen del libro"
              className="w-full rounded object-contain"
            />
          </div>
        ) : null}

        {cert.signatureUrl ? (
          <div className="rounded border p-3">
            <div className="text-sm mb-2">Firma digital</div>
            <img
              src={cert.signatureUrl}
              alt="Firma digital"
              className="w-full rounded object-contain"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
