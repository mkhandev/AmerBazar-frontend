// app/api/proxy/route.js
export async function GET() {
  const liveUrl = "https://mkhandev.kesug.com/api/v1/categories";

  try {
    const response = await fetch(liveUrl);

    if (!response.ok) {
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: `Failed to fetch: ${text}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    // remove type annotation
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
