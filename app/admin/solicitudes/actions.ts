//app/admin/solicitudes/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
}

export async function aprobarSolicitud(id: string) {
  await requireAdmin();
  await prisma.adoption.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/solicitudes");
}

export async function rechazarSolicitud(id: string) {
  await requireAdmin();
  await prisma.adoption.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/solicitudes");
}
