import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please do login");

    const res = await fetch(`${apiUrl}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    //console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user info", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user info", error },
      { status: 500 }
    );
  }
}
