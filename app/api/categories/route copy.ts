import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://161.248.189.58/~mkhandev/myapp/public/api/v1/categories"
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
