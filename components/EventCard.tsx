"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  date: string;
  location?: string;
  bannerUrl?: string;
  description?: string;
};

export default function EventCard({
  title,
  date,
  location = "",
  bannerUrl = "",
  description = "",
}: Props) {
  const [open, setOpen] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* TARJETA (click abre modal) */}
      <button
        onClick={() => setOpen(true)}
        className="text-left rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
      >
        {/* Imagen perfectamente ajustada al cuadro */}
        <div className="relative w-full aspect-[16/9] bg-slate-200">
          {bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bannerUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-600">{date}</p>
          {location && (
            <p className="text-sm text-slate-600">Lugar: {location}</p>
          )}
          {description && (
            <p className="mt-2 text-sm text-slate-700 line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </button>

      {/* LIGHTBOX / MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo oscuro (click cierra) */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Contenido */}
          <div className="relative z-10 max-w-3xl w-[92vw] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl">
            <div className="relative w-full aspect-[16/9] bg-slate-200">
              {bannerUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bannerUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white text-lg leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="text-sm text-slate-600">{date}</p>
              {location && (
                <p className="text-sm text-slate-600">Lugar: {location}</p>
              )}
              {description && (
                <p className="pt-2 text-slate-800 whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
