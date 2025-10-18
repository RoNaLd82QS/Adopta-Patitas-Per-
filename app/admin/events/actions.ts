"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

/* helpers */
const clean = (v: FormDataEntryValue | null): string | null =>
  (typeof v === "string" ? v.trim() : "") || null;

const getFile = (fd: FormData, name: string): File | null => {
  const v = fd.get(name);
  return v instanceof File && v.size > 0 ? v : null;
};

/* crear */
export async function createEvent(formData: FormData) {
  const title = clean(formData.get("title")) || "";
  const dateStr = clean(formData.get("date")) || "";
  const location = clean(formData.get("location"));
  const description = clean(formData.get("description"));
  const banner = getFile(formData, "banner");

  if (!title || !dateStr) return;

  const bannerUrl = await saveImage(banner, "events");

  await prisma.event.create({
    data: {
      title,
      date: new Date(dateStr),
      location,
      description,
      bannerUrl,
      published: true,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

/* actualizar */
export async function updateEvent(id: string, formData: FormData) {
  const title = clean(formData.get("title")) || "";
  const dateStr = clean(formData.get("date")) || "";
  const location = clean(formData.get("location"));
  const description = clean(formData.get("description"));
  const banner = getFile(formData, "banner");

  const bannerUrl = await saveImage(banner, "events");

  await prisma.event.update({
    where: { id },
    data: {
      title,
      date: new Date(dateStr),
      location,
      description,
      ...(bannerUrl ? { bannerUrl } : {}),
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

/* publicar/ocultar */
export async function togglePublish(id: string, next: boolean, _fd: FormData) {
  await prisma.event.update({
    where: { id },
    data: { published: next },
  });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

/* eliminar */
export async function deleteEvent(id: string, _fd: FormData) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
