// app/admin/donations/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

function clean(v: FormDataEntryValue | null): string | null {
  return typeof v === "string" ? v.trim() || null : null;
}
function getFile(fd: FormData, name: string): File | null {
  const v = fd.get(name);
  return v instanceof File && v.size > 0 ? v : null;
}

export async function createDonation(formData: FormData) {
  const bankName = clean(formData.get("bankName")) || "";
  const account = clean(formData.get("account")) || "";
  const cci = clean(formData.get("cci"));

  const logo = getFile(formData, "logo");
  const yapeQr = getFile(formData, "yapeQr");
  const plinQr = getFile(formData, "plinQr");

  if (!bankName || !account) return;

  const [logoUrl, yapeQrUrl, plinQrUrl] = await Promise.all([
    saveImage(logo, "donations"),
    saveImage(yapeQr, "donations"),
    saveImage(plinQr, "donations"),
  ]);

  await prisma.donationMethod.create({
    data: { bankName, account, cci, logoUrl, yapeQrUrl, plinQrUrl },
  });

  revalidatePath("/admin/donations");
  revalidatePath("/como-donar"); // página pública
}

export async function updateDonation(id: string, formData: FormData) {
  if (!id) return;

  // Trae lo actual para mantener URLs si no suben archivos nuevos
  const current = await prisma.donationMethod.findUnique({ where: { id } });
  if (!current) return;

  const bankName = clean(formData.get("bankName")) ?? current.bankName;
  const account = clean(formData.get("account")) ?? current.account;
  const cci = clean(formData.get("cci")); // puede ser null

  const logo = getFile(formData, "logo");
  const yapeQr = getFile(formData, "yapeQr");
  const plinQr = getFile(formData, "plinQr");

  const [logoUrl, yapeQrUrl, plinQrUrl] = await Promise.all([
    logo ? saveImage(logo, "donations") : Promise.resolve(current.logoUrl),
    yapeQr
      ? saveImage(yapeQr, "donations")
      : Promise.resolve(current.yapeQrUrl),
    plinQr
      ? saveImage(plinQr, "donations")
      : Promise.resolve(current.plinQrUrl),
  ]);

  await prisma.donationMethod.update({
    where: { id },
    data: { bankName, account, cci, logoUrl, yapeQrUrl, plinQrUrl },
  });

  revalidatePath("/admin/donations");
  revalidatePath("/como-donar");
}

export async function deleteDonation(id: string) {
  if (!id) return;
  await prisma.donationMethod.delete({ where: { id } });
  revalidatePath("/admin/donations");
  revalidatePath("/como-donar");
}
