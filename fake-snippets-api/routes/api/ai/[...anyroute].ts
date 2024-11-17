/**
 * Forward request to anthropic
 */
export default async (req: Request) => {
  const url = new URL(req.url);
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicApiKey) {
    return new Response("Anthropic API key is not set", { status: 500 });
  }

  const anthropicUrl =
    "https://api.anthropic.com" + url.pathname.replace(/^\/api\/ai/, "");

  const headers = new Headers(req.headers);
  headers.set("x-api-key", `${anthropicApiKey}`);

  console.log("sending request to anthropic");
  const response = await fetch(anthropicUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
    // @ts-ignore
    duplex: "half",
  }).then((r) => r.json());

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
