const API_BASE = "https://mkhandev.kesug.com/api/v1"; // 👈 your Laravel API base URL

const ALLOWED_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://amar-bazar-phi.vercel.app" // your Vercel domain
    : "*";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function GET() {
  try {
    // 👇 Call your Laravel API
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { Accept: "application/json" },
    });

    const text = await res.text(); // get raw response
    console.log("Laravel response:", res.status, text);

    if (!res.ok) {
      // Laravel returned error
      return new Response(JSON.stringify({ error: text }), {
        status: res.status,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      });
    }

    // Parse JSON if valid
    const data = JSON.parse(text);
    return Response.json(data, {
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
