// app/api/adoptions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      petId,
      adopterPhone,
      address,
      district,
      province,
      motivation,
      photos, // string[] opcional
    } = body ?? {};

    if (!petId) {
      return NextResponse.json(
        { error: "petId es requerido" },
        { status: 400 }
      );
    }

    // 1) Usuario debe existir
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "El correo no está registrado" },
        { status: 403 }
      );
    }

    // 2) Mascota debe existir
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true },
    });
    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // 3) Busca por (petId, adopterEmail) y actualiza o crea
    const existing = await prisma.adoption.findFirst({
      where: { petId, adopterEmail: user.email },
      select: { id: true },
    });

    let adoptionId: string;

    if (existing) {
      const updated = await prisma.adoption.update({
        where: { id: existing.id },
        data: {
          adopterName: user.name ?? user.email,
          adopterPhone: adopterPhone ?? null,
          address: address ?? null,
          district: district ?? null,
          province: province ?? null,
          motivation: motivation ?? null,
          // si deseas forzar estado pendiente en cada reintento:
          // status: "PENDING",
        },
        select: { id: true },
      });
      adoptionId = updated.id;
    } else {
      const created = await prisma.adoption.create({
        data: {
          petId,
          userId: user.id,
          adopterEmail: user.email,
          adopterName: user.name ?? user.email,
          adopterPhone: adopterPhone ?? null,
          address: address ?? null,
          district: district ?? null,
          province: province ?? null,
          motivation: motivation ?? null,
          status: "PENDING",
        },
        select: { id: true },
      });
      adoptionId = created.id;
    }

    // 4) (Opcional) reemplazar fotos
    if (Array.isArray(photos)) {
      await prisma.$transaction([
        prisma.adoptionPhoto.deleteMany({ where: { adoptionId } }),
        photos.length
          ? prisma.adoptionPhoto.createMany({
              data: photos.map((url: string) => ({ adoptionId, url })),
            })
          : prisma.adoptionPhoto.deleteMany({ where: { adoptionId } }),
      ]);
    }

    return NextResponse.json({ ok: true, adoptionId });
  } catch (err: any) {
    console.error("POST /api/adoptions error:", err);
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
