// FeatureGate Worker Entry Point
// Routes API requests and serves static assets from Cloudflare Pages

export interface Env {
  FLAGS: KVNamespace;
  AUDIT_LOG: KVNamespace;
  DB: D1Database;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API routes
    if (url.pathname.startsWith("/api/")) {
      return handleAPI(request, env, url);
    }

    // Static assets handled by Cloudflare Pages asset binding
    return new Response("Not Found", { status: 404 });
  },
};

async function handleAPI(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Health check
    if (url.pathname === "/api/health") {
      return Response.json(
        { data: { status: "ok", environment: env.ENVIRONMENT || "development" }, error: null, meta: {} },
        { headers }
      );
    }

    // Flag evaluation (hot path -- KV only)
    if (url.pathname === "/api/v1/evaluate" && request.method === "POST") {
      const body = await request.json() as { flagKey: string; context: Record<string, unknown> };
      const flag = await env.FLAGS.get(body.flagKey, "json");
      if (!flag) {
        return Response.json(
          { data: null, error: "Flag not found", meta: {} },
          { status: 404, headers }
        );
      }
      return Response.json(
        { data: flag, error: null, meta: {} },
        { headers }
      );
    }

    return Response.json(
      { data: null, error: "Not found", meta: {} },
      { status: 404, headers }
    );
  } catch {
    return Response.json(
      { data: null, error: "Internal server error", meta: {} },
      { status: 500, headers }
    );
  }
}
