import prisma from "@/lib/prisma";
import EventCard from "@/components/EventCard";

export const metadata = { title: "Eventos" };

function fmtDate(date: Date) {
  return new Date(date).toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EventosPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
  });

  const now = new Date();
  const upcoming = events.filter((e) => e.date >= now);
  const past = events.filter((e) => e.date < now).reverse();

  return (
    <main>
      {/* HERO */}
      <section className="bg-teal-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight">
            Eventos
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Participa en nuestras actividades y campañas. ¡Tu presencia también
            salva vidas!
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        {/* Próximos */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Próximos</h2>
          {upcoming.length === 0 ? (
            <p className="text-slate-500">Aún no hay eventos próximos.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  date={fmtDate(e.date)}
                  location={e.location ?? ""}
                  bannerUrl={e.bannerUrl ?? ""}
                  description={e.description ?? ""}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pasados */}
        {past.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pasados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  date={fmtDate(e.date)}
                  location={e.location ?? ""}
                  bannerUrl={e.bannerUrl ?? ""}
                  description={e.description ?? ""}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
