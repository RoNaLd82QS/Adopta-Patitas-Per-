"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFollowUp(formData: FormData) {
  const petId = String(formData.get("petId") || "");
  const adopterName = String(formData.get("adopterName") || "").trim() || "—";
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!petId) throw new Error("Selecciona una mascota");

  await prisma.followUp.create({
    data: { petId, adopterName, notes },
  });
  revalidatePath("/admin/followups");
}

export async function deleteFollowUp(id: string) {
  await prisma.followUp.delete({ where: { id } });
  revalidatePath("/admin/followups");
}

export async function addFollowUpPhoto(formData: FormData) {
  const followUpId = String(formData.get("followUpId") || "");
  const url = String(formData.get("url") || "").trim();

  if (!followUpId || !url) throw new Error("Falta seguimiento o URL");

  await prisma.followUpPhoto.create({ data: { followUpId, url } });
  revalidatePath("/admin/followups");
}

export async function deleteFollowUpPhoto(id: string) {
  await prisma.followUpPhoto.delete({ where: { id } });
  revalidatePath("/admin/followups");
}
