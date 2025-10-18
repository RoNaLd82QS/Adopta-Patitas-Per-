"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    birthDate: "",
    address: "",
    district: "",
    province: "",
    dni: "",
    email: "",
    password: "",
    confirm: "",
  });
  const router = useRouter();

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registro exitoso. Ahora inicia sesión.");
      router.push("/login");
    } else {
      alert(data?.error || "No se pudo registrar");
    }
  }

  return (
    <section className="max-w-2xl mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Registro para adoptar</h1>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Nombre</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Apellido</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Fecha de nacimiento</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Dirección (dónde vive)</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Distrito</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.district}
            onChange={(e) => set("district", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Provincia</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.province}
            onChange={(e) => set("province", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">DNI (número de ley)</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.dni}
            onChange={(e) => set("dni", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Confirmar contraseña</label>
          <input
            type="password"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <button className="rounded-lg bg-blue-600 text-white px-4 py-2">
            Crear cuenta
          </button>
        </div>
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
