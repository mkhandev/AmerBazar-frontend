import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
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

    const res = await fetch(`${apiUrl}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to add order data", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add order data", error },
      { status: 500 }
    );
  }
}
