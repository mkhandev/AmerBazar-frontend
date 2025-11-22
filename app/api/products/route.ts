import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const queryString = new URLSearchParams({
      page,
      ...(category && { category }),
      ...(status && { status }),
      ...(q && { q }),
    }).toString();

    const res = await fetch(`${apiUrl}/products?${queryString}`, {
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
    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const formData = await request.formData();

    console.log(formData);

    const res = await fetch(`${apiUrl}/add-product`, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type, browser will handle multipart/form-data boundary
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await res.json();

    // console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to add product", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add product", error: error.message || error },
      { status: 500 }
    );
  }
}
