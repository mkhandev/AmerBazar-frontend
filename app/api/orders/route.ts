import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const status = searchParams.get("status") || "";
    const order_number = searchParams.get("order_number") || "";
    const payment_status = searchParams.get("payment_status") || "";
    const payment_method = searchParams.get("payment_method") || "";

    const queryString = new URLSearchParams({
      page,
      ...(order_number && { order_number: order_number }),
      ...(status && { status }),
      ...(payment_status && { payment_status: payment_status }),
      ...(payment_method && { payment_method: payment_method }),
    }).toString();

    const res = await fetch(`${apiUrl}/orders?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user order list", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch cart", error },
      { status: 500 }
    );
  }
}

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

    const res = await fetch(`${apiUrl}/orders`, {
      method: "POST",
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
