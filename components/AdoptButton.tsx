//components/AdoptButton.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function AdoptButton({ petId }: { petId: string }) {
  const { status, data } = useSession();
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // p.ej. /adopta/<id> para callback

  async function handleAdopt() {
    if (status !== "authenticated" || !data?.user?.email) {
      setShowModal(true);
      return;
    }
    try {
      setSending(true);
      const res = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId }),
      });
      const json = await res.json();

      if (!res.ok) {
        alert(json?.error || "No se pudo registrar la solicitud");
        return;
      }
      alert("¡Solicitud enviada! Te contactaremos por email.");
      router.push("/profile"); // o donde quieras llevarlo
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={handleAdopt}
        disabled={sending}
        className="rounded bg-amber-400 px-4 py-2 font-medium hover:bg-amber-500 disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Quiero adoptar"}
      </button>

      {/* Modal simple */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Necesitas iniciar sesión</h3>
            <p className="mt-2 text-sm text-slate-600">
              Para enviar una solicitud de adopción debes iniciar sesión con tu
              correo registrado.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
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
    </>
  );
}
