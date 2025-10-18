// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        const email = String(c?.email ?? "").toLowerCase();
        const pass = String(c?.password ?? "");
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(pass, user.passwordHash);
        if (!ok) return null;

        // lo que metas aquí pasa al token en el callback jwt
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role; // mete el rol en el token
      return token;
    },
    async session({ session, token }) {
      // expón el rol en la sesión del cliente/servidor
      if (token?.role) (session.user as any).role = token.role;
      return session;
    },
  },
};

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // no logueado -> a login con callback
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  // logueado pero no admin -> al home
  if ((session.user as any).role !== "ADMIN") redirect("/");
  return session;
}
