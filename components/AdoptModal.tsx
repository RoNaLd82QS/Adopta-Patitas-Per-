//components/AdoptModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  open: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
  petDescription?: string | null;
};

export default function AdoptModal({
  open,
  onClose,
  petId,
  petName,
  petDescription,
}: Props) {
  const { data } = useSession();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [motivation, setMotivation] = useState("");
  const [photoUrlsText, setPhotoUrlsText] = useState(""); // separados por coma
  const [acceptCommitments, setAcceptCommitments] = useState(false);

  // Prefill nombre con el de la sesión si existe
  useEffect(() => {
    if (!open) return;
    setError(null);
    if (data?.user?.name) setFullName((v) => v || data.user!.name!);
  }, [open, data?.user?.name]);

  const photoUrls = useMemo(() => {
    return photoUrlsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [photoUrlsText]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptCommitments) {
      setError("Debes aceptar los compromisos del adoptante.");
      return;
    }
    if (!fullName || !address || !district || !province) {
      setError("Completa nombre y dirección (dirección, distrito y provincia).");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          adopterName: fullName,
          adopterPhone: phone || null,
          address,
          district,
          province,
          motivation: motivation || null,
          photos: photoUrls, // arreglo de urls
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "No se pudo registrar la solicitud");
      }

      // listo
      onClose();
      alert("¡Solicitud enviada! Te contactaremos pronto.");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 overflow-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Cabecera */}
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold">
            Formulario de adopción — {petName}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Completa tus datos. El equipo revisará tu solicitud.
          </p>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Resumen de la mascota */}
          {!!petDescription && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium">Descripción de la mascota</p>
              <p className="mt-1 text-slate-600 whitespace-pre-line">
                {petDescription}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium">Nombres y apellidos</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Ana Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Opcional"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Dirección</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle / Av., número, referencia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Distrito</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Provincia</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                ¿Por qué quieres adoptar?
              </label>
              <textarea
                className="mt-1 w-full rounded border px-3 py-2"
                rows={3}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Cuéntanos brevemente tu motivación (opcional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Fotos del espacio (URLs separadas por coma)
              </label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={photoUrlsText}
                onChange={(e) => setPhotoUrlsText(e.target.value)}
                placeholder="https://…, https://…"
              />
              <p className="mt-1 text-xs text-slate-500">
                Puedes subir tus imágenes a Drive/Imgur y pegar los enlaces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="commit"
              type="checkbox"
              className="mt-1"
              checked={acceptCommitments}
              onChange={(e) => setAcceptCommitments(e.target.checked)}
            />
            <label htmlFor="commit" className="text-sm">
              Acepto los compromisos del adoptante (alimentación, cuidados,
              no abandono y permitir seguimiento).
            </label>
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Pie */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
              disabled={sending}
            >
              {sending ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
