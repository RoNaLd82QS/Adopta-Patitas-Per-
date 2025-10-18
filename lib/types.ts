import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER";
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: "ADMIN" | "USER";
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER";
  }
}
export type Method = {
  id: string;
  createdAt: Date;
  bankName: string;
  account: string;
  cci: string | null;
  logoUrl: string | null;
  yapeQrUrl: string | null;
  plinQrUrl: string | null;
  yapeHolder: string | null; // <-- nuevo
  plinHolder: string | null; // <-- nuevo
};
