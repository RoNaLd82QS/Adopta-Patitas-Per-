// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // evita múltiples instancias en dev (hot reload)
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  globalThis.prisma = prisma;
}

// Si quieres poder hacer import default prisma
export default prisma;
