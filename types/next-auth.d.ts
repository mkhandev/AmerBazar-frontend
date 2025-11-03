import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // added accessToken
  }

  interface User {
    token?: string; // your JWT token
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
