"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

type Item = {
  key: string;
  label: string;
  filename: string;
  accept?: string;
  hint?: string;
};

const ITEMS: Item[] = [
  // Slider
  {
    key: "hero1",
    label: "Hero 1 (1920x900, JPG)",
    filename: "hero1.jpg",
    accept: "image/jpeg",
    hint: "Imagen grande del slider",
  },
  {
    key: "hero2",
    label: "Hero 2 (1920x900, JPG)",
    filename: "hero2.jpg",
    accept: "image/jpeg",
  },
  {
    key: "hero3",
    label: "Hero 3 (1920x900, JPG)",
    filename: "hero3.jpg",
    accept: "image/jpeg",
  },

  // Quiénes somos / Apadrina
  {
    key: "qs",
    label: "Quiénes somos (1200x900, JPG)",
    filename: "quienes-somos.jpg",
    accept: "image/jpeg",
  },
  {
    key: "apa",
    label: "Apadrina (1200x900, JPG)",
    filename: "apadrina.jpg",
    accept: "image/jpeg",
  },

  // Círculos Adopta
  {
    key: "a1",
    label: "Adopta círculo 1 (320x320, JPG)",
    filename: "a1.jpg",
    accept: "image/jpeg",
  },
  {
    key: "a2",
    label: "Adopta círculo 2 (320x320, JPG)",
    filename: "a2.jpg",
    accept: "image/jpeg",
  },
  {
    key: "a3",
    label: "Adopta círculo 3 (320x320, JPG)",
    filename: "a3.jpg",
    accept: "image/jpeg",
  },
  {
    key: "a4",
    label: "Adopta círculo 4 (320x320, JPG)",
    filename: "a4.jpg",
    accept: "image/jpeg",
  },

  // Aliados (logos)
  {
    key: "ally1",
    label: "Aliado 1 (PNG transparencia)",
    filename: "ally1.png",
    accept: "image/png",
  },
  {
    key: "ally2",
    label: "Aliado 2 (PNG transparencia)",
    filename: "ally2.png",
    accept: "image/png",
  },
  {
    key: "ally3",
    label: "Aliado 3 (PNG transparencia)",
    filename: "ally3.png",
    accept: "image/png",
  },
  {
    key: "ally4",
    label: "Aliado 4 (PNG transparencia)",
    filename: "ally4.png",
    accept: "image/png",
  },

  // Equipo (agrega más si quieres)
  {
    key: "team1",
    label: "Equipo 1 (800x600, JPG)",
    filename: "team1.jpg",
    accept: "image/jpeg",
  },
  {
    key: "team2",
    label: "Equipo 2 (800x600, JPG)",
    filename: "team2.jpg",
    accept: "image/jpeg",
  },
  {
    key: "team3",
    label: "Equipo 3 (800x600, JPG)",
    filename: "team3.jpg",
    accept: "image/jpeg",
  },
];

function Uploader({ item }: { item: Item }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "up" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function upload() {
    if (!file) return;
    setStatus("up");
    setMsg("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", item.filename);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al subir");
      setStatus("ok");
      setMsg(`Subido: ${data.url}`);
    } catch (e: any) {
      setStatus("err");
      setMsg(e.message || "Error");
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="font-medium">{item.label}</div>
      <div className="text-xs text-slate-500">
        Se guardará como: <code>/{item.filename}</code>
        {item.hint ? ` — ${item.hint}` : ""}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={item.accept}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={upload}
          disabled={!file || status === "up"}
          className="rounded-md bg-blue-600 text-white text-sm px-3 py-1.5 disabled:opacity-50"
        >
          {status === "up" ? "Subiendo..." : "Subir"}
        </button>
        {msg && (
          <span
            className={`text-sm ${
              status === "err" ? "text-red-600" : "text-slate-700"
            }`}
          >
            {msg}
          </span>
        )}
      </div>

      <div className="text-xs">
        Actual:{" "}
        <a
          className="text-blue-700 underline"
          href={`/${item.filename}`}
          target="_blank"
        >
          /{item.filename}
        </a>
      </div>

      {/* Vista rápida */}
      <div className="rounded-lg border bg-slate-50 p-2">
        {/* usamos <img> simple para no requerir config de next/image */}
        <img
          src={`/${item.filename}`}
          alt={item.label}
          className="max-h-40 object-contain mx-auto"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='160'><rect width='100%' height='100%' fill='#eef2f7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#64748b' font-family='Arial' font-size='14'>Sin imagen (${item.filename})</text></svg>`
              );
          }}
        />
      </div>
    </div>
  );
}

export default function AdminImagesPage() {
  const { data: session, status } = useSession();
  const role = (session as any)?.role || (session?.user as any)?.role || "USER";

  if (status === "loading") {
    return <div className="max-w-5xl mx-auto p-6">Cargando…</div>;
  }

  if (!session || role !== "ADMIN") {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-3">
        <h1 className="text-xl font-bold">No autorizado</h1>
        <p className="text-slate-600">
          Necesitas iniciar sesión como administrador.
        </p>
        <Link className="text-blue-700 underline" href="/login">
          Ir a Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de imágenes</h1>
      <p className="text-slate-600 text-sm">
        Sube imágenes con el nombre exacto que la web espera. Se guardan en{" "}
        <code>/public</code> y se muestran automáticamente en el Home.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <Uploader key={it.key} item={it} />
        ))}
      </div>
    </section>
  );
}
