import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { apiUrl } from "@/lib/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ authorize() called with:", credentials);

        try {
          const res = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data?.user || !data?.token) {
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            token: data.token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = user.token as string;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
