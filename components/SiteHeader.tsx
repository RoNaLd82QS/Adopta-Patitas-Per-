import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // asegúrate que exportas authOptions

export default async function SiteHeader() {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.user?.role ?? (session as any)?.role ?? "USER";
  const isLoggedIn = Boolean(session);
  const isAdmin = role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold tracking-tight">
          Adoptapatitas <span className="text-blue-600">Perú</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link href="/adopta">Adopta</Link>
          <Link href="/como-adoptar">Cómo adoptar</Link>
          <span className="text-slate-400">
            Blog <sup className="text-xs">pronto</sup>
          </span>
          <span className="text-slate-400">
            Nosotros <sup className="text-xs">pronto</sup>
          </span>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            isAdmin ? (
              <Link
                href="/admin"
                className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/admin"
                className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
              >
                Panel
              </Link>
            )
          ) : (
            <Link
              href="/login"
              className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
            >
              Iniciar sesión
            </Link>
          )}

          {isLoggedIn && (
            <form action="/api/auth/signout" method="post">
              <input type="hidden" name="callbackUrl" value="/" />
              <button
                type="submit"
                className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
              >
                Salir
              </button>
            </form>
          )}

          <Link
            href={isLoggedIn ? "/ayuda" : "/login"}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-yellow-400 text-slate-900 hover:bg-yellow-500"
          >
            {isLoggedIn ? "AYUDA AQUÍ" : "INICIAR SESIÓN"}
          </Link>
        </div>
      </div>
    </header>
  );
}
