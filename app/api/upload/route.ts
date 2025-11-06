//app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // necesitamos acceso a fs

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const filename = (form.get("filename") as string | null)?.trim();

  if (!file || !filename) {
    return NextResponse.json(
      { error: "Falta archivo o nombre" },
      { status: 400 }
    );
  }

  // Solo permitimos estas extensiones
  if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    return NextResponse.json(
      { error: "Extensión no permitida" },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(process.cwd(), "public", filename);
  await writeFile(filePath, bytes);

  return NextResponse.json({ ok: true, url: `/${filename}` });
}
