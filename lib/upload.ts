import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";

const ALLOWED = ["image/jpeg", "image/png", "image/jpg"];

export async function saveImage(file: File | null, subdir = "donations") {
  if (!file || file.size === 0) return null;
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa .jpg o .png");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? ".png" : ".jpg";
  const name = `${randomUUID()}${ext}`;

  const dir = `public/uploads/${subdir}`;
  await mkdir(dir, { recursive: true });

  const fsPath = `${dir}/${name}`;
  await writeFile(fsPath, buffer);

  // ruta pública
  return `/uploads/${subdir}/${name}`;
}
