//app/admin/layout.tsx
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth"; // deja este import si ya lo usas
import PillLink from "@/components/PillLink";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // protección (si ya tienes requireAdmin, déjalo)
  if (typeof requireAdmin === "function") {
    await requireAdmin();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>

      <nav className="mb-8 flex flex-wrap gap-2">
        <PillLink href="/admin" exact>
          Dashboard
        </PillLink>
        <PillLink href="/admin/users">Usuarios</PillLink> {/* nuevo */}
        <PillLink href="/admin/donations">Donaciones</PillLink>
        <PillLink href="/admin/events">Eventos</PillLink>
        <PillLink href="/admin/pets">Mascotas</PillLink>
        <PillLink href="/admin/followups">Seguimientos</PillLink>
        <PillLink href="/admin/images">Imágenes</PillLink>
      </nav>

      {children}
    </section>
  );
}
