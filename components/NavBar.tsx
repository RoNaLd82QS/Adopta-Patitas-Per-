// components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`text-sm ${
        active ? "text-slate-900 font-medium" : "text-slate-600"
      } hover:text-slate-900`}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isInAdmin = pathname.startsWith("/admin");

  const email = session?.user?.email ?? null;
  const role = (session as any)?.user?.role || (session as any)?.role || "USER";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Adopta<strong className="text-slate-900">patitas</strong>{" "}
          <span className="text-blue-600">Perú</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <MenuLink href="/como-donar">Donaciones</MenuLink>
          <MenuLink href="/adopta">Adopta</MenuLink>
          <MenuLink href="/events">Eventos</MenuLink>
        </nav>

        <div className="flex items-center gap-2">
          {/* Logueado */}
          {email ? (
            <>
              {/* Correo del usuario como acceso a su perfil */}
              <Link
                href="/perfil"
                title="Ver mi perfil"
                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium"
              >
                {email}
              </Link>

              {/* Si es admin, muestra chip para entrar al panel */}
              {role === "ADMIN" && !isInAdmin && (
                <Link
                  href="/admin"
                  className="rounded-full bg-amber-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                Salir
              </button>
            </>
          ) : (
            // No logueado
            <Link
              href="/login"
              className="rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-slate-900 hover:bg-yellow-500"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
