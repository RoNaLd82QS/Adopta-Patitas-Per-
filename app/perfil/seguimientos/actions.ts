//app/perfil/seguimientos/actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload"; // ya lo tienes en lib/upload.ts

const ok = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function createMyFollowUp(formData: FormData) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("No autorizado");

  const petId = String(formData.get("petId") ?? "");
  const notes = (String(formData.get("notes") ?? "").trim() || null) as
    | string
    | null;
  if (!petId) throw new Error("petId requerido");

  // Debe existir una adopción TUYA para esa mascota
  const adoption = await prisma.adoption.findFirst({
    where: { petId, adopterEmail: email },
    select: { id: true, adopterName: true, adopterEmail: true },
  });
  if (!adoption)
    throw new Error("No se encontró una adopción tuya para esta mascota.");

  // Fotos opcionales: photo0..photo9
  const files: File[] = [];
  for (let i = 0; i < 10; i++) {
    const f = formData.get(`photo${i}`) as File | null;
    if (f && f.size > 0) files.push(f);
  }
  const urls = (
    await Promise.all(files.map((f) => saveImage(f, "followups")))
  ).filter(ok);

  await prisma.followUp.create({
    data: {
      petId,
      adoptionId: adoption.id, // vínculo a tu adopción
      adopterName: adoption.adopterName ?? adoption.adopterEmail,
      notes,
      photos: urls.length
        ? { create: urls.map((u) => ({ url: u })) }
        : undefined,
    },
  });

  revalidatePath("/perfil/seguimientos");
}

export async function addMyFollowUpPhotos(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("No autorizado");

  const owner = await prisma.followUp.findUnique({
    where: { id },
    select: { adoption: { select: { adopterEmail: true } } },
  });
  if (!owner || owner.adoption?.adopterEmail !== email)
    throw new Error("No autorizado");

  const files: File[] = [];
  for (let i = 0; i < 10; i++) {
    const f = formData.get(`photo${i}`) as File | null;
    if (f && f.size > 0) files.push(f);
  }
  if (files.length === 0) return;

  const urls = (
    await Promise.all(files.map((f) => saveImage(f, "followups")))
  ).filter(ok);
  if (urls.length === 0) return;

  await prisma.followUp.update({
    where: { id },
    data: { photos: { create: urls.map((u) => ({ url: u })) } },
  });

  revalidatePath(`/perfil/seguimientos/${id}`);
}

export async function deleteMyFollowUp(formData: FormData) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("No autorizado");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const row = await prisma.followUp.findUnique({
    where: { id },
    select: { adoption: { select: { adopterEmail: true } } },
  });
  if (!row || row.adoption?.adopterEmail !== email)
    throw new Error("No autorizado");

  await prisma.followUp.delete({ where: { id } });
  revalidatePath("/perfil/seguimientos");
}
