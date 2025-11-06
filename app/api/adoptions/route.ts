// app/api/adoptions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { petId } = await req.json();

  // 1) El correo debe existir en la tabla User (usuarios registrados)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { email: true, name: true },
  });
  if (!user) {
    return NextResponse.json(
      { error: "El correo no está registrado" },
      { status: 403 }
    );
  }

  // 2) Evita duplicados por (petId, adopterEmail)
  const already = await prisma.adoption.findFirst({
    where: { petId, adopterEmail: session.user.email },
    select: { id: true },
  });
  if (already) {
    return NextResponse.json(
      { error: "Ya enviaste una solicitud para esta mascota" },
      { status: 409 }
    );
  }

  // 3) Crea la solicitud
  await prisma.adoption.create({
    data: {
      petId,
      adopterEmail: session.user.email,
      adopterName: user.name ?? session.user.email,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true });
}
