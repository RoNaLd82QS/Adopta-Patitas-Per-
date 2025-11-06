// components/AdoptButton.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AdoptModal from "./AdoptModal";

export default function AdoptButton({
  petId,
  petName,
  petDescription,
}: {
  petId: string;
  petName: string;
  petDescription?: string | null;
}) {
  const { status } = useSession();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  function handleClick() {
    if (status !== "authenticated") {
      setShowLogin(true);
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded bg-amber-400 px-4 py-2 font-medium hover:bg-amber-500"
      >
        Quiero adoptar
      </button>

      {/* modal de login rápido */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Necesitas iniciar sesión</h3>
            <p className="mt-2 text-sm text-slate-600">
              Para enviar una solicitud debes iniciar sesión.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowLogin(false)}
                className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
              <a
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Iniciar sesión
              </a>
            </div>
          </div>
        </div>
      )}

      {/* modal de adopción */}
      <AdoptModal
        open={open}
        onClose={() => setOpen(false)}
        petId={petId}
        petName={petName}
        petDescription={petDescription}
      />
    </>
  );
}
