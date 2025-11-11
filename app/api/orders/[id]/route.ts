import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("Order ID is required");

    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const res = await fetch(`${apiUrl}/orders/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: data.message || "Failed to fetch order details from server",
          error: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch order details", error },
      { status: 500 }
    );
  }
}
