// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session_cart_id = (await cookies()).get("session_cart_id")?.value;
    if (!session_cart_id) throw new Error("Cart  session not found");

    const urlFetch = `${apiUrl}/cart/${session_cart_id}`;

    const res = await fetch(urlFetch, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
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
    const user_id = session?.user?.id ? (session.user.id as string) : undefined;

    const payload = {
      ...body,
      session_cart_id,
      ...(user_id && { user_id }),
    };

    const res = await fetch(`${apiUrl}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add item", error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const session_cart_id = (await cookies()).get("session_cart_id")?.value;
    if (!session_cart_id) throw new Error("Cart session not found");

    const session = await auth();
    const user_id = session?.user?.id ? (session.user.id as string) : undefined;

    const payload = {
      ...body,
      ...(user_id && { user_id }),
    };

    console.log(payload);

    const res = await fetch(
      `${apiUrl}/cart/${session_cart_id}/item/${body.item_id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    //console.log(res);

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update item", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session_cart_id = (await cookies()).get("session_cart_id")?.value;
    if (!session_cart_id) throw new Error("Cart  session not found");

    const body = await request.json();

    console.log(body);
    console.log(session_cart_id);

    const res = await fetch(
      `${apiUrl}/cart/${session_cart_id}/item/${body.item_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove item", error },
      { status: 500 }
    );
  }
}
