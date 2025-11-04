// app/admin/followups/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

/** Utilidad: deja solo strings no vacíos */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/* ---------------------------------------------------------
 *  Crear seguimiento con hasta 10 fotos (photo0..photo9)
 * --------------------------------------------------------- */
export async function createFollowUp(formData: FormData) {
  const petId = String(formData.get("petId") ?? "");
  const adopterName = String(formData.get("adopterName") ?? "").trim();
  const notes = (String(formData.get("notes") ?? "").trim() || null) as
    | string
    | null;

  if (!petId || !adopterName) return;

  const files: File[] = [];
  for (let i = 0; i < 10; i++) {
    const f = formData.get(`photo${i}`) as File | null;
    if (f && f.size > 0) files.push(f);
  }

  const urls = (
    await Promise.all(files.map((f) => saveImage(f, "followups")))
  ).filter(isNonEmptyString);

  const created = await prisma.followUp.create({
    data: {
      petId,
      adopterName,
      notes,
      photos: urls.length
        ? { create: urls.map((u) => ({ url: u })) }
        : undefined,
    },
    select: { id: true },
  });

  revalidatePath("/admin/followups");
  revalidatePath(`/admin/followups/${created.id}`);
}

/* ---------------------------------------------------------
 *  Agregar fotos nuevas a un seguimiento existente
 *  – espera photo0..photo9 en el form de subida
 * --------------------------------------------------------- */
export async function addFollowUpPhotos(id: string, formData: FormData) {
  const files: File[] = [];
  for (let i = 0; i < 10; i++) {
    const f = formData.get(`photo${i}`) as File | null;
    if (f && f.size > 0) files.push(f);
  }

  if (files.length === 0) return;

  const urls = (
    await Promise.all(files.map((f) => saveImage(f, "followups")))
  ).filter(isNonEmptyString);

  if (urls.length === 0) return;

  await prisma.followUp.update({
    where: { id },
    data: { photos: { create: urls.map((u) => ({ url: u })) } },
  });

  revalidatePath(`/admin/followups/${id}`);
}

/* ---------------------------------------------------------
 *  Actualizar cabecera (adoptante y notas)
 * --------------------------------------------------------- */
export async function updateFollowUp(id: string, formData: FormData) {
  const adopterName = String(formData.get("adopterName") ?? "").trim();
  const notes = (String(formData.get("notes") ?? "").trim() || null) as
    | string
    | null;

  if (!adopterName) return;

  await prisma.followUp.update({
    where: { id },
    data: { adopterName, notes },
  });

  revalidatePath("/admin/followups");
  revalidatePath(`/admin/followups/${id}`);
}

/* ---------------------------------------------------------
 *  Eliminar foto individual
 * --------------------------------------------------------- */
export async function deletePhoto(formData: FormData) {
  const photoId = String(formData.get("photoId") ?? "");
  const followUpId = String(formData.get("followUpId") ?? "");
  if (!photoId) return;

  await prisma.followUpPhoto.delete({ where: { id: photoId } });

  revalidatePath(`/admin/followups/${followUpId}`);
}

/* ---------------------------------------------------------
 *  Eliminar seguimiento completo
 * --------------------------------------------------------- */
export async function deleteFollowUp(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.followUp.delete({ where: { id } });

  revalidatePath("/admin/followups");
}
