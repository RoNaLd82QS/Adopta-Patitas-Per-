import prisma from "@/lib/prisma";

export const metadata = { title: "Cómo donar" };

export default async function ComoDonarPage() {
  const methods = await prisma.donationMethod.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      {/* HERO */}
      <section className="relative">
        <div className="bg-teal-600 text-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
            <p className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
              Ayúdanos a ayudar
            </p>
          </div>
        </div>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 pt-4 md:pt-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-teal-600 uppercase tracking-tight">
              Donaciones
            </h1>
          </div>
        </div>
      </section>

      {/* LISTA DE BANCOS (grande) */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {methods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            Aún no hay métodos bancarios publicados.
          </div>
        ) : (
          <div className="space-y-10 md:space-y-12">
            {methods.map((m) => (
              <article
                key={m.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 md:p-12"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Logo grande */}
                  {m.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.logoUrl}
                      alt={`Logo ${m.bankName}`}
                      className="h-20 md:h-28 w-auto object-contain mb-4"
                    />
                  ) : (
                    <div className="h-20 md:h-28 w-40 rounded-xl bg-slate-100 mb-4" />
                  )}

                  {/* Nombre del banco */}
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {m.bankName}
                  </h2>

                  {/* Frase como el ejemplo */}
                  <p className="mt-4 max-w-2xl text-slate-700 text-base md:text-lg">
                    Si deseas puedes donar voluntariamente en nuestra cuenta
                    soles
                  </p>

                  {/* Números grandes */}
                  <div className="mt-8 space-y-3">
                    <p className="font-mono font-extrabold text-2xl md:text-3xl tracking-wider text-slate-900">
                      {m.account}
                    </p>
                    {m.cci && (
                      <p className="font-mono font-bold text-xl md:text-2xl tracking-wider text-slate-900">
                        Interbancario {m.cci}
                      </p>
                    )}
                  </div>

                  {/* (Opcional) Yape / Plin — se muestran más pequeño debajo */}
                  {(m.yapeHolder ||
                    m.yapeQrUrl ||
                    m.plinHolder ||
                    m.plinQrUrl) && (
                    <div className="mt-8 grid gap-4 md:grid-cols-2 w-full max-w-2xl">
                      {(m.yapeHolder || m.yapeQrUrl) && (
                        <SmallWallet
                          brand="Yape"
                          holder={m.yapeHolder || undefined}
                          qrUrl={m.yapeQrUrl || undefined}
                          color="violet"
                        />
                      )}
                      {(m.plinHolder || m.plinQrUrl) && (
                        <SmallWallet
                          brand="Plin"
                          holder={m.plinHolder || undefined}
                          qrUrl={m.plinQrUrl || undefined}
                          color="emerald"
                        />
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------- UI auxiliar para Yape/Plin (pequeño) ---------- */

function SmallWallet({
  brand,
  holder,
  qrUrl,
  color = "violet",
}: {
  brand: string;
  holder?: string;
  qrUrl?: string;
  color?: "violet" | "emerald";
}) {
  const tones = {
    violet: "border-violet-200 bg-violet-50 text-violet-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  } as const;

  return (
    <div className={`rounded-2xl border p-4 text-center ${tones[color]}`}>
      <p className="font-semibold">{brand}</p>
      {holder && <p className="text-sm opacity-90 mt-1">Titular: {holder}</p>}
      {qrUrl && (
        <a
          href={qrUrl}
          target="_blank"
          className="inline-block mt-3 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Ver QR
        </a>
      )}
    </div>
  );
}
