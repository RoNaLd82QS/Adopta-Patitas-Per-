// app/admin/certificados/[id]/pdf/route.ts
export const runtime = "nodejs";

import PDFDocument from "pdfkit";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PassThrough, Readable } from "node:stream";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(d);
}

type RouteCtx = { params: { id: string } };

export async function GET(_req: Request, ctx: RouteCtx) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return new Response("No autorizado", { status: 401 });
  }

  const cert = await prisma.adoptionCertificate.findUnique({
    where: { id: ctx.params.id },
    include: {
      adoption: {
        include: {
          pet: { select: { name: true, species: true } },
          user: { select: { name: true, email: true } },
        },
      },
    },
  });
  if (!cert) return new Response("No encontrado", { status: 404 });

  const a = cert.adoption!;
  const adopter = a.adopterName || a.user?.name || a.adopterEmail;

  const doc = new PDFDocument({
    size: "A4",
    margin: 56,
    info: { Title: "Certificado de adopción" },
  });
  const pass = new PassThrough();
  doc.pipe(pass);
  const stream = Readable.toWeb(pass) as unknown as ReadableStream<Uint8Array>;

  const COLORS = {
    band: "#0b1220",
    text: "#111827",
    mute: "#6b7280",
    line: "#e5e7eb",
  };

  // Encabezado
  doc.save();
  doc.rect(44, 28, doc.page.width - 88, 36).fill(COLORS.band);
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(20);
  doc.text("Certificado de adopción", 56, 34, { align: "center" });
  doc.restore();

  doc.moveDown(1.5);
  doc.font("Helvetica").fontSize(10).fillColor(COLORS.mute);
  doc.text(`N° ${cert.certificateNumber}`);
  doc.text(`Emitido: ${fmt(cert.issuedAt)}`);
  doc.moveDown(0.6);

  // Caja principal
  doc.save();
  const boxX = 56, boxW = doc.page.width - 112;
  doc.roundedRect(boxX, doc.y, boxW, 170, 8).strokeColor(COLORS.line).stroke();

  const left = boxX + 14;
  const width = boxW - 28;

  doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.text);
  doc.text("Se certifica que:", left, doc.y + 10);

  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(12);
  doc.text(`• La mascota: ${a.pet?.name} (${a.pet?.species})`, { width });
  doc.text(`• Ha sido adoptada por: ${adopter}`, { width });
  doc.text(`• Correo de contacto: ${a.user?.email || a.adopterEmail}`, { width });
  doc.moveDown(0.6);

  doc.font("Helvetica").fontSize(11).fillColor(COLORS.text);
  doc.text(
    "Este documento acredita la entrega responsable y el compromiso de cuidado y bienestar de la mascota adoptada, conforme a las políticas de Adopta-patitas Perú.",
    { width }
  );
  doc.restore();

  doc.moveDown(8);

  // Firma
  const signY = doc.y + 10;
  if (cert.signatureUrl) {
    try {
      doc.image(cert.signatureUrl, 96, signY - 20, { width: 140, fit: [160, 60] });
    } catch {}
  }
  doc.font("Helvetica").fontSize(10).fillColor(COLORS.mute);
  doc.text("Firma", 136, signY + 44, { align: "center", width: 60 });
  doc.moveDown(3);

  // Imagen del libro (opcional)
  if (cert.bookImageUrl) {
    doc.addPage();
    doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.text);
    doc.text("Registro en libro", 56, 56);
    doc.moveDown(0.6);
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.mute);
    doc.text("Evidencia del asiento/registro asociado al certificado.");
    doc.moveDown(0.6);
    try {
      const maxW = doc.page.width - 112;
      doc.image(cert.bookImageUrl, 56, doc.y, { width: maxW, fit: [maxW, 640] });
    } catch {
      doc.fillColor("#dc2626").text("No se pudo cargar la imagen del libro.");
    }
  }

  // Pie
  const anyDoc = doc as any;
  const count = anyDoc.page.document._pageBuffer.length as number;
  for (let i = 0; i < count; i++) {
    doc.switchToPage(i);
    doc.font("Helvetica").fontSize(9).fillColor(COLORS.mute);
    doc.text(`Página ${i + 1} de ${count}`, 56, doc.page.height - 40, {
      width: doc.page.width - 112,
      align: "right",
    });
  }

  doc.end();

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cert.certificateNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
