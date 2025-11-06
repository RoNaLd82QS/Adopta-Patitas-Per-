// app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Body = {
  email: string;
  password: string;
  confirm: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const {
      email: rawEmail,
      password = "",
      confirm = "",
    } = (await req.json()) as Body;

    const email = (rawEmail || "").trim().toLowerCase();
    if (!isEmail(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }
    if (password !== confirm) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, passwordHash }, // role USER por defecto en tu schema
      select: { id: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo registrar" },
      { status: 500 }
    );
  }
}
