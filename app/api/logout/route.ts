import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { apiUrl } from "@/lib/constants";
import { cookies } from "next/headers";

export async function POST() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { message: "Already logged out" },
      { status: 200 }
    );
  }

  try {
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  } catch (err) {
    console.error("Logout failed", err);
  }

  //cookies().delete("session_cart_id");
  (await cookies()).delete("session_cart_id");

  await signOut({
    redirect: true,
    redirectTo: "/",
  });

  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
