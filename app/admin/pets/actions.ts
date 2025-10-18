"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

/** helpers */
function s(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
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

  if (!name) return;

  await prisma.pet.create({
    data: {
      name,
      species,
      sex,
      ageMonths,
      weightKg,
      description,
      photoUrl,
    },
  });

  revalidatePath("/admin/pets");
  revalidatePath("/adopta");
}

/** Actualizar mascota */
export async function updatePet(id: string, formData: FormData) {
  const name = s(formData.get("name"));
  const species = (s(formData.get("species")) || "DOG") as "DOG" | "CAT";
  const sex = (s(formData.get("sex")) || "MALE") as "MALE" | "FEMALE";
  const ageMonths = Number(s(formData.get("ageMonths"))) || 0;

  const w = formData.get("weightKg");
  const weightKg = typeof w === "string" && w !== "" ? Number(w) : null;

  const description = s(formData.get("description")) || null;

  // si suben una foto nueva, la guardamos y actualizamos; si no, mantenemos la actual
  const photo = formData.get("photo") as File | null;
  const newPhotoUrl = await saveImage(photo, "pets"); // string | null

  const data: any = {
    name,
    species,
    sex,
    ageMonths,
    weightKg,
    description,
  };
  if (newPhotoUrl) data.photoUrl = newPhotoUrl;

  await prisma.pet.update({
    where: { id },
    data,
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
