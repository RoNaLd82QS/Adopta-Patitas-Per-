// app/admin/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  // Contadores
  const [users, pets, events, donations] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.event.count(),
    prisma.donationMethod.count(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold mb-5">Panel de administración</h1>

      {/* Píldoras de navegación */}
      <nav className="mb-6 flex flex-wrap gap-2">
        <Pill href="/admin" active>
          Dashboard
        </Pill>
        <Pill href="/admin/users">Usuarios</Pill>
        <Pill href="/admin/donations">Donaciones</Pill>
        <Pill href="/admin/events">Eventos</Pill>
        <Pill href="/admin/pets">Mascotas</Pill>
        <Pill href="/admin/followups">Seguimientos</Pill>
        <Pill href="/admin/images">Imágenes</Pill>
      </nav>

      {/* Tarjetas de métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Usuarios" value={users} />
        <Stat title="Mascotas" value={pets} />
        <Stat title="Eventos" value={events} />
        <Stat title="Donaciones" value={donations} />
      </div>
    </section>
  );
}

/* ——— helpers UI ——— */

function Pill({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  const base =
    "inline-flex items-center rounded-full border px-4 py-2 text-sm transition";
  const state = active ? "bg-slate-900 text-white" : "hover:bg-slate-100";
  return (
    <Link href={href} className={`${base} ${state}`}>
      {children}
    </Link>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
