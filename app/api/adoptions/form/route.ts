// app/api/adoptions/form/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: stream -> Buffer
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (c: any) =>
      chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function GET(req: Request) {
  try {
    // Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Query
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId")?.trim();
    if (!petId) {
      return NextResponse.json({ error: "Falta petId" }, { status: 400 });
    }

    // Usuario registrado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { email: true, name: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Correo no registrado" },
        { status: 403 }
      );
    }

    // Mascota
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: {
        name: true,
        species: true,
        sex: true,
        ageMonths: true,
        weightKg: true,
        description: true,
      },
    });
    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // pdfkit (CJS/ESM compatible)
    const PDFKitAny = (await import("pdfkit")) as any;
    const PDFDocument = PDFKitAny.default ?? PDFKitAny;

    // Documento + bufferPromise (enganchar antes de escribir)
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 48, left: 54, right: 54, bottom: 54 },
    });
    const bufferPromise = streamToBuffer(doc);

    // --- Contenido (solo Times-Roman, sin italics) ---
    const edadA = Math.floor((pet.ageMonths ?? 0) / 12);
    const edadM = (pet.ageMonths ?? 0) % 12;

    doc
      .font("Times-Roman")
      .fontSize(18)
      .text("Formulario de Adopción", { align: "center" })
      .moveDown(0.5);
    doc
      .fontSize(10)
      .text(`Generado para: ${session.user.email}`, { align: "center" })
      .moveDown(1.2);

    doc
      .fontSize(13)
      .text("Datos de la mascota", { underline: true })
      .moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Nombre: ${pet.name}`);
    doc.text(`Especie: ${pet.species === "DOG" ? "Perro" : "Gato"}`);
    doc.text(`Sexo: ${pet.sex === "MALE" ? "Macho" : "Hembra"}`);
    doc.text(`Edad: ${edadA} años ${edadM} meses`);
    doc.text(`Peso (aprox.): ${pet.weightKg ?? "-"} kg`);
    doc.moveDown(0.5);
    doc.text("Descripción:");
    doc.text(pet.description || "—", { align: "justify" });
    doc.moveDown(1.2);

    const line = (label: string) => {
      doc.text(`${label}: `);
      const x = doc.x as number,
        y = doc.y as number;
      doc
        .moveTo(x, y + 12)
        .lineTo(x + 420, y + 12)
        .strokeColor("#888")
        .stroke();
      doc.moveDown(0.8);
    };

    doc
      .fontSize(13)
      .text("Datos del solicitante", { underline: true })
      .moveDown(0.5)
      .fontSize(11);
    line("Nombres y apellidos");
    line("DNI / CE / Pasaporte");
    line("Fecha de nacimiento");
    line("Teléfono");
    line("Correo electrónico");
    line("Dirección");
    line("Distrito / Provincia");

    doc
      .moveDown(0.5)
      .text("¿Vivienda?:  [ ] Propia   [ ] Alquilada   [ ] Familiar");
    doc
      .moveDown(0.5)
      .text("Tipo de vivienda:  [ ] Casa   [ ] Departamento   [ ] Quinta");
    doc
      .moveDown(0.5)
      .text(
        "¿Hay niños en casa?:  [ ] Sí   [ ] No     ¿Otros animales?:  [ ] Sí   [ ] No"
      );
    doc.moveDown(0.5).text("Explique brevemente su motivación para adoptar:");
    const bxX = doc.x as number,
      bxY = (doc.y as number) + 4;
    doc.rect(bxX, bxY, 450, 100).strokeColor("#999").stroke();
    doc.moveDown(6);

    doc
      .fontSize(13)
      .text("Compromisos del adoptante", { underline: true })
      .moveDown(0.5)
      .fontSize(11);
    doc.text(
      "■ Proveer alimentación, cuidados veterinarios y espacio adecuado."
    );
    doc.text("■ No abandonar ni maltratar al animal.");
    doc.text("■ Permitir visitas o seguimiento de la adopción.");
    doc.moveDown(1);

    line("Firma del solicitante");
    doc.text("Fecha: ");
    const sigX = doc.x as number,
      sigY = doc.y as number;
    doc
      .moveTo(sigX + 35, sigY + 12)
      .lineTo(sigX + 200, sigY + 12)
      .strokeColor("#888")
      .stroke();

    // Cerrar doc -> dispara 'end'
    doc.end();

    // Buffer -> Uint8Array (BodyInit válido)
    const buffer = await bufferPromise;
    const body = new Uint8Array(buffer);
    const filename = `Formulario_Adopcion_${pet.name}.pdf`;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    // 💡 Mira el terminal de Next (server) para ver el stack:
    console.error("[/api/adoptions/form] ERROR:", err?.stack || err);
    return NextResponse.json(
      { error: "No se pudo generar el PDF" },
      { status: 500 }
    );
  }
}
