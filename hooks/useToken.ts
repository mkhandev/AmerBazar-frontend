import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export function useToken() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function getValidToken(): string | null {
    if (status === "loading") return null;

    if (status === "unauthenticated") {
      redirect("/signin");
      return null;
    }

    const token = session?.accessToken;
    if (!token) {
      redirect("/signin");
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        redirect("/signin");
        return null;
      }
      return token;
    } catch {
      redirect("/signin");
      return null;
    }
  }

  return { getValidToken, status };
}
