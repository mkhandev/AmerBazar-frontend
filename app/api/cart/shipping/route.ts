import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { apiUrl } from "@/lib/constants";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const session_cart_id = (await cookies()).get("session_cart_id")?.value;
    if (!session_cart_id) throw new Error("Cart session not found");

    const session = await auth();
    const user_id = session?.user?.id;
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const payload = {
      ...body,
      session_cart_id,
      ...(user_id && { user_id }),
    };

    const res = await fetch(`${apiUrl}/cart/shipping`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to update shipping info", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "An error occurred while updating shipping info",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
