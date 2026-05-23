// Parse a gig-platform earnings screenshot with Lovable AI vision.
// Returns structured rows via tool-calling. No DB writes here — the client
// performs RLS-bound inserts using its own session.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const tool = {
  type: "function",
  function: {
    name: "report_earnings",
    description:
      "Report parsed earnings rows from a gig-app screenshot (Swiggy, Zomato, Uber, Rapido, Ola, Dunzo, etc).",
    parameters: {
      type: "object",
      properties: {
        confidence: {
          type: "number",
          description: "Overall confidence 0-1 in the parse.",
        },
        rows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              platform: {
                type: "string",
                description:
                  "Platform name. One of: Swiggy, Zomato, Uber, Rapido, Ola, Dunzo, Direct_GigAI, Other.",
              },
              amount_earned: {
                type: "number",
                description: "Total earnings in INR for that platform on that day.",
              },
              trips: {
                type: "number",
                description: "Number of trips/orders if visible, else 0.",
              },
              date: {
                type: "string",
                description: "ISO date YYYY-MM-DD. If not visible, use today.",
              },
            },
            required: ["platform", "amount_earned", "date"],
            additionalProperties: false,
          },
        },
      },
      required: ["rows", "confidence"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require authenticated caller — protects paid AI credits from abuse
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authErr } = await supabase.auth.getClaims(token);
    if (authErr || !claims?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY missing" }, 500);

    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return json({ error: "image (data URL) is required" }, 400);
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an OCR engine for Indian gig-worker earnings screenshots. Read totals per platform and call the report_earnings tool. If only one platform is visible, return a single row. Never invent numbers.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Parse the earnings shown in this screenshot." },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "report_earnings" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      if (resp.status === 429) return json({ error: "Rate limited. Try again shortly." }, 429);
      if (resp.status === 402) return json({ error: "AI credits exhausted." }, 402);
      console.error("gateway error", resp.status, t);
      return json({ error: "AI gateway error" }, 500);
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return json({ error: "No structured output from model" }, 502);

    const args = JSON.parse(call.function.arguments);

    // Audit log: record the AI invocation against the caller's worker profile
    try {
      const { data: worker } = await supabase
        .from("worker_profiles")
        .select("id")
        .eq("user_id", claims.claims.sub)
        .maybeSingle();
      if (worker?.id) {
        await supabase.rpc("log_audit", {
          _worker_id: worker.id,
          _action: "ai_parse_earning",
          _amount: null,
          _metadata: {
            rows: args.rows?.length ?? 0,
            confidence: args.confidence ?? null,
            model: "google/gemini-2.5-flash",
          },
        });
      }
    } catch (logErr) {
      console.error("audit log failed", logErr);
    }

    return json(args);
  } catch (e) {
    console.error("parse-earning crash", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
