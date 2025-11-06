import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login?callbackUrl=/perfil");

  return (
    <section className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mi perfil</h1>
      <div className="rounded border bg-white p-4">
        <div className="text-sm text-slate-600">Correo</div>
        <div className="font-medium">{session.user.email}</div>
      </div>
      <p className="text-slate-600">
        Aquí podrás mostrar tus datos y el historial de solicitudes de adopción.
      </p>
    </section>
  );
}
