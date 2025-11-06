// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");
      alert("Registro exitoso. Ahora inicia sesión.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="border rounded-lg px-3 py-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            className="border rounded-lg px-3 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-sm">Confirmar contraseña</label>
          <input
            type="password"
            className="border rounded-lg px-3 py-2 w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Ya tengo cuenta:{" "}
        <a className="text-blue-700 underline" href="/login">
          Iniciar sesión
        </a>
      </p>
    </section>
  );
}
