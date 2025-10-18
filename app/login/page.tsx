"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.ok) router.push(callbackUrl);
    else alert("Credenciales inválidas");
  }

  return (
    <section className="max-w-md mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="rounded-lg bg-blue-600 text-white px-4 py-2">
          Entrar
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        ¿No tienes cuenta?{" "}
        <a className="text-blue-700 underline" href="/register">
          Regístrate
        </a>
      </p>
    </section>
  );
}
