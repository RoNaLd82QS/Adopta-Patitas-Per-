// app/admin/certificados/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { saveImage } from "@/lib/upload";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
}

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function onlyString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

// Genera algo como "CERT-2025-000123"
function generateNumber() {
  const y = new Date().getFullYear();
  const r = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `CERT-${y}-${r}`;
}

export async function createCertificate(formData: FormData) {
  await requireAdmin();

  const adoptionId = onlyString(formData.get("adoptionId"));
  if (!adoptionId) throw new Error("adoptionId requerido");

  // valida adopción existente
  const adoption = await prisma.adoption.findUnique({
    where: { id: adoptionId },
    include: {
      pet: { select: { name: true, species: true } },
      user: { select: { name: true, email: true } },
    },
  });
  if (!adoption) throw new Error("Adopción no encontrada");

  // archivos
  const book = formData.get("bookImage") as File | null;
  const sign = formData.get("signature") as File | null;

  // <-- TIPAR COMO string | null
  let bookImageUrl: string | null = null;
  let signatureUrl: string | null = null;

  if (book && book.size > 0) {
    const url = await saveImage(book, "certificados"); // string | null
    if (isNonEmptyString(url)) bookImageUrl = url;
  }

  if (sign && sign.size > 0) {
    const url = await saveImage(sign, "certificados"); // string | null
    if (isNonEmptyString(url)) signatureUrl = url;
  }

  const certificateNumber =
    onlyString(formData.get("certificateNumber")) || generateNumber();

  // upsert: un certificado por adopción
  const cert = await prisma.adoptionCertificate.upsert({
    where: { adoptionId },
    create: {
      adoptionId,
      certificateNumber,
      // convertir null -> undefined para que Prisma omita el campo si no hay imagen
      bookImageUrl: bookImageUrl ?? undefined,
      signatureUrl: signatureUrl ?? undefined,
    },
    update: {
      certificateNumber,
      bookImageUrl: bookImageUrl ?? undefined,
      signatureUrl: signatureUrl ?? undefined,
      issuedAt: new Date(),
    },
    select: { id: true },
  });

  redirect(`/admin/certificados/${cert.id}`);
}
