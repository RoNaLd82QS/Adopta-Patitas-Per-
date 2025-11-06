//app/admin/pets/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

/** helpers */
function s(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}
function toNumberOrNull(v: FormDataEntryValue | null) {
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function pickAgeMonths(fd: FormData) {
  // admite ageMonths directamente, o ageYears (conversión -> meses)
  const months = toNumberOrNull(fd.get("ageMonths"));
  if (months !== null) return Math.max(0, months);

  const years = toNumberOrNull(fd.get("ageYears"));
  if (years !== null) return Math.max(0, years * 12);

  return 0;
}

/** Crear mascota */
export async function createPet(formData: FormData) {
  const name = s(formData.get("name"));
  const species = (s(formData.get("species")) || "DOG") as "DOG" | "CAT";
  const sex = (s(formData.get("sex")) || "MALE") as "MALE" | "FEMALE";
  const ageMonths = Number(s(formData.get("ageMonths"))) || 0;

  const w = formData.get("weightKg");
  const weightKg = typeof w === "string" && w !== "" ? Number(w) : null;

  const description = s(formData.get("description")) || null;

  const photo = formData.get("photo") as File | null;
  const photoUrl = await saveImage(photo, "pets"); // string | null

  await prisma.pet.create({
    data: { name, species, sex, ageMonths, weightKg, description, photoUrl },
  });

  revalidatePath("/admin/pets");
  revalidatePath("/adopta");
}

/** Actualizar mascota */
export async function updatePet(id: string, formData: FormData) {
  const name = s(formData.get("name"));
  const species = (s(formData.get("species")) || "DOG") as "DOG" | "CAT";
  const sex = (s(formData.get("sex")) || "MALE") as "MALE" | "FEMALE";
  const ageMonths = pickAgeMonths(formData);

  const weightKg = toNumberOrNull(formData.get("weightKg"));
  const description = s(formData.get("description")) || null;

  const file = formData.get("photo") as File | null;
  const newPhotoUrl = await saveImage(file, "pets"); // string | null

  await prisma.pet.update({
    where: { id },
    data: {
      name,
      species,
      sex,
      ageMonths,
      weightKg,
      description,
      ...(newPhotoUrl ? { photoUrl: newPhotoUrl } : {}),
    },
  });

  revalidatePath("/admin/pets");
  revalidatePath("/adopta");
}

/** Eliminar mascota */
export async function deletePet(formData: FormData) {
  const id = s(formData.get("id"));
  if (!id) return;
  await prisma.pet.delete({ where: { id } });
  revalidatePath("/admin/pets");
  revalidatePath("/adopta");
}
