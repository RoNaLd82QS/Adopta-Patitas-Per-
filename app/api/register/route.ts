import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      name,
      lastName,
      birthDate,
      address,
      district,
      province,
      dni,
      email,
      password,
    } = await req.json();

    if (
      !name ||
      !lastName ||
      !birthDate ||
      !address ||
      !district ||
      !province ||
      !dni ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: email.toLowerCase() }, { dni }] },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email o DNI ya registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
        name,
        lastName,
        birthDate: new Date(birthDate),
        address,
        district,
        province,
        dni,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
