// app/admin/certificados/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Certificados | Admin" };

export default async function CertificadosIndex() {
  // Certificados emitidos
  const certs = await prisma.adoptionCertificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      adoption: {
        select: {
          id: true,
          adopterName: true,
          adopterEmail: true,
          pet: { select: { name: true, species: true } },
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  // Adopciones sin certificado (para mostrar botón "Crear certificado")
  const pendientes = await prisma.adoption.findMany({
    where: {
      certificate: { is: null }, // 👈 ya no filtra por status
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      adopterName: true,
      adopterEmail: true,
      pet: { select: { name: true, species: true } },
      user: { select: { name: true, email: true } },
      status: true,
    },
  });

  return (
    <section className="space-y-10">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Certificados de adopción</h2>
      </header>

      {/* Emitidos */}
      <div>
        <h3 className="mb-3 font-medium">Emitidos</h3>
        <div className="rounded border divide-y bg-white">
          {certs.map((c) => {
            const a = c.adoption!;
            const adoptante = a.adopterName || a.user?.name || a.adopterEmail;
            const correo = a.user?.email || a.adopterEmail;

            return (
              <div
                key={c.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-medium">
                    #{c.certificateNumber} · {a.pet?.name} ({a.pet?.species})
                  </div>
                  <div className="text-sm text-slate-600 truncate">
                    Adoptante: {adoptante} · {correo}
                  </div>
                  <div className="text-xs text-slate-500">
                    Emitido: {new Date(c.issuedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/admin/certificados/${c.id}`}
                    className="rounded border px-3 py-2"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin/certificados/${c.id}/pdf`}
                    className="rounded bg-slate-800 text-white px-3 py-2"
                  >
                    Descargar PDF
                  </Link>
                </div>
              </div>
            );
          })}

          {certs.length === 0 && (
            <div className="p-6 text-slate-500">Aún no hay certificados.</div>
          )}
        </div>
      </div>

      {/* Adopciones sin certificado */}
      <div>
        <h3 className="mb-3 font-medium">
          Adopciones aprobadas sin certificado
        </h3>
        <div className="rounded border divide-y bg-white">
          {pendientes.map((a) => {
            const adoptante = a.adopterName || a.user?.name || a.adopterEmail;
            const correo = a.user?.email || a.adopterEmail;

            return (
              <div
                key={a.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-medium">
                    {a.pet?.name} ({a.pet?.species})
                  </div>
                  <div className="text-sm text-slate-600 truncate">
                    Adoptante: {adoptante} · {correo}
                  </div>
                </div>
                <Link
                  href={`/admin/certificados/new?adoptionId=${a.id}`}
                  className="rounded bg-emerald-600 text-white px-3 py-2"
                >
                  Crear certificado
                </Link>
              </div>
            );
          })}

          {pendientes.length === 0 && (
            <div className="p-6 text-slate-500">
              Todo al día: no hay adopciones aprobadas pendientes de
              certificado.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
