// app/admin/solicitudes/pdf/route.ts
export const runtime = "nodejs";

import PDFDocument from "pdfkit";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PassThrough, Readable } from "node:stream";

type Badge = "PENDING" | "APPROVED" | "REJECTED";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export async function GET(req: Request) {
  // Solo ADMIN
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return new Response("No autorizado", { status: 401 });
  }

  // Filtro opcional por email
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") ?? undefined;

  // Datos
  const rows = await prisma.adoption.findMany({
    where: email ? { adopterEmail: email } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      pet: { select: { name: true, species: true } },
    },
  });

  // PDFKit -> stream web
  const doc = new PDFDocument({
    size: "A4",
    margin: 42,
    info: { Title: "Solicitudes de adopción" },
  });
  const pass = new PassThrough();
  doc.pipe(pass);
  const stream = Readable.toWeb(pass) as unknown as ReadableStream<Uint8Array>;

  // ======== Estilos / layout ========
  const COLORS = {
    text: "#1f2937",
    mute: "#6b7280",
    line: "#e5e7eb",
    headBg: "#f3f4f6",
    band: "#111827",
    zebra: "#fafafa",
    pendingBg: "#fef3c7",
    pendingTx: "#92400e",
    okBg: "#dcfce7",
    okTx: "#166534",
    badBg: "#fee2e2",
    badTx: "#991b1b",
  };

  const PAGE = {
    top: 42,
    left: 42,
    right: 42,
    bottom: 42,
    width: 595.28 - 42 - 42, // A4 width - margins
  };

  const COLS = [
    { key: "fecha", w: 105, title: "Fecha" },
    { key: "mascota", w: 120, title: "Mascota" },
    { key: "adopt", w: 170, title: "Adoptante" },
    { key: "cont", w: 150, title: "Contacto" },
    { key: "estado", w: 60, title: "Estado" },
  ] as const;
  // calcular x acumuladas a partir de PAGE.left
  const colX: number[] = [];
  {
    let acc = PAGE.left;
    for (const c of COLS) {
      colX.push(acc);
      acc += c.w;
    }
  }

  function drawBand() {
    // Banda superior
    doc.save();
    doc
      .rect(PAGE.left - 12, PAGE.top - 28, PAGE.width + 24, 28)
      .fill(COLORS.band);
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(18);
    doc.text("Solicitudes de adopción", PAGE.left, PAGE.top - 22, {
      width: PAGE.width,
      align: "center",
    });
    doc.restore();

    // Subtítulo
    doc.fontSize(9).fillColor(COLORS.mute);
    doc.text(`Generado: ${fmtDate(new Date())}`, PAGE.left, PAGE.top + 2);
    if (email) doc.text(`Filtrado por: ${email}`, PAGE.left, doc.y + 2);
    doc.moveDown(0.6);
  }

  function drawHeaderRow() {
    const y = doc.y + 4;
    doc.save();
    doc.rect(PAGE.left - 2, y - 4, PAGE.width + 4, 24).fill(COLORS.headBg);
    doc.restore();

    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.text);
    COLS.forEach((c, i) => {
      doc.text(c.title, colX[i], y, { width: c.w });
    });

    doc
      .moveTo(PAGE.left, y + 22)
      .lineTo(PAGE.left + PAGE.width, y + 22)
      .strokeColor(COLORS.line)
      .stroke();

    doc.moveDown(0.2);
  }

  function ensureSpace(minHeight = 80) {
    if (doc.y + minHeight > doc.page.height - PAGE.bottom) {
      doc.addPage();
      drawBand();
      drawHeaderRow();
    }
  }

  function badge(status: Badge) {
    switch (status) {
      case "PENDING":
        return {
          bg: COLORS.pendingBg,
          tx: COLORS.pendingTx,
          text: "PENDIENTE",
        };
      case "APPROVED":
        return { bg: COLORS.okBg, tx: COLORS.okTx, text: "APROBADA" };
      case "REJECTED":
        return { bg: COLORS.badBg, tx: COLORS.badTx, text: "RECHAZADA" };
    }
  }

  // Helpers de medida con fuente/tamaño controlados (evita usar font en TextOptions)
  function measureHeight(
    text: string,
    width: number,
    font = "Helvetica",
    size = 10
  ) {
    doc.save();
    doc.font(font).fontSize(size);
    const h = doc.heightOfString(text, { width });
    doc.restore();
    return h;
  }
  function measureWidth(text: string, font = "Helvetica", size = 10) {
    doc.save();
    doc.font(font).fontSize(size);
    const w = doc.widthOfString(text);
    doc.restore();
    return w;
  }

  function drawRow(r: (typeof rows)[number], index: number) {
    const mascota = r.pet?.name ? `${r.pet.name} (${r.pet.species})` : "—";
    const adopt = r.adopterName || r.user?.name || "—";
    const cont = r.user?.email || r.adopterEmail || "—";
    const fecha = fmtDate(r.createdAt);

    // Altura de la fila básica (sin dirección/motivación)
    const h =
      Math.max(
        measureHeight(fecha, COLS[0].w),
        measureHeight(mascota, COLS[1].w),
        measureHeight(adopt, COLS[2].w),
        measureHeight(cont, COLS[3].w),
        14
      ) + 6;

    ensureSpace(h + 60);

    // Cebra
    if (index % 2 === 1) {
      doc.save();
      doc
        .rect(PAGE.left - 2, doc.y - 2, PAGE.width + 4, h + 4)
        .fill(COLORS.zebra);
      doc.restore();
    }

    // Texto de columnas
    const y0 = doc.y;
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.text);
    doc.text(fecha, colX[0], y0, { width: COLS[0].w });
    doc.text(mascota, colX[1], y0, { width: COLS[1].w });
    doc.text(adopt, colX[2], y0, { width: COLS[2].w });
    doc.text(cont, colX[3], y0, { width: COLS[3].w });

    // Badge de estado
    const b = badge(r.status as Badge);
    const padX = 6;
    const padY = 3;
    const badgeW = Math.min(
      measureWidth(b.text, "Helvetica-Bold", 9) + padX * 2,
      COLS[4].w
    );
    const badgeH = 16;
    const bx = colX[4];
    const by = y0 + 1;

    doc.save();
    doc.roundedRect(bx, by, badgeW, badgeH, 4).fill(b.bg);
    doc.fillColor(b.tx).font("Helvetica-Bold").fontSize(9);
    doc.text(b.text, bx + padX, by + padY - 1, {
      width: badgeW - padX * 2,
      align: "left",
    });
    doc.restore();

    // Mover cursor a fin de fila
    doc.y = y0 + h;

    // Bloques extra: Dirección & Motivación (si existen)
    const dline = [r.address, r.district, r.province]
      .filter(Boolean)
      .join(", ");
    if (dline || r.motivation) {
      ensureSpace(70);
      doc.fontSize(10).fillColor(COLORS.text);
      if (dline) {
        doc
          .font("Helvetica-Bold")
          .text("Dirección: ", PAGE.left, doc.y + 2, { continued: true });
        doc.font("Helvetica").text(dline, { width: PAGE.width });
      }
      if (r.motivation) {
        doc
          .font("Helvetica-Bold")
          .text("Motivación: ", PAGE.left, doc.y + 2, { continued: true });
        doc.font("Helvetica").text(r.motivation, { width: PAGE.width });
      }
    }

    // Separador
    doc.moveDown(0.4);
    doc
      .moveTo(PAGE.left, doc.y)
      .lineTo(PAGE.left + PAGE.width, doc.y)
      .strokeColor(COLORS.line)
      .stroke();
    doc.moveDown(0.2);
  }

  function footer() {
    const anyDoc = doc as any;
    const pageCount = anyDoc.page.document._pageBuffer.length as number;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor(COLORS.mute);
      doc.text(
        `Página ${i + 1} de ${pageCount}`,
        PAGE.left,
        doc.page.height - PAGE.bottom + 14,
        {
          width: PAGE.width,
          align: "right",
        }
      );
    }
  }

  // ======== Render ========
  drawBand();
  drawHeaderRow();
  rows.forEach((r, i) => drawRow(r, i));
  footer();
  doc.end();

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="solicitudes${
        email ? `_${encodeURIComponent(email)}` : ""
      }.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
