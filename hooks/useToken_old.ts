import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useToken() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  function getValidToken() {
    useEffect(() => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.push("/signin");
        return;
      }

      const accessToken = session?.accessToken;
      if (!accessToken) {
        router.push("/signin");
        return;
      }

      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
          router.push("/signin");
          return;
        }

        setToken(accessToken); // ✅ store valid token
      } catch {
        router.push("/signin");
      }
    }, [status, session, router]);
  }

  return { getValidToken, token, status };
}
