import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { apiUrl } from "@/lib/constants";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.token as string;
        token.id = user.id;
        token.role = user.role;

        console.log(user);

        if (trigger === "signIn") {
          const session_cart_id = (await cookies()).get(
            "session_cart_id"
          )?.value;

          if (session_cart_id) {
            try {
              const cartRes = await fetch(`${apiUrl}/cart/${session_cart_id}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${user.token}`,
                  Accept: "application/json",
                },
              });

              const cartData = await cartRes.json();
              if (cartRes.ok && cartData?.data?.length) {
                await fetch(`${apiUrl}/cart/update-user`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                  body: JSON.stringify({
                    session_cart_id,
                    user_id: user.id,
                  }),
                });
              }
            } catch (error) {
              console.log("Cart sync failed:", error);
            }
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = (token.sub ?? token.id) as string;
      session.user.role = token.role as string;

      return session;
    },
  },
});
