import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (!secret || secret !== process.env.N8N_SHARED_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      status,
      clients:client_id (
        client_id, client_name, digest_emails, urgent_emails, universe_tickers, timezone
      )
    `)
    .in("status", ["active", "trialing"])
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const out = (data || [])
    .map((row: any) => row.clients)
    .filter(Boolean)
    .map((c: any) => ({
      client_id: c.client_id,
      client_name: c.client_name,
      digest_emails: c.digest_emails,
      urgent_emails: c.urgent_emails,
      universeTickers: (c.universe_tickers || "")
        .split(",")
        .map((t: string) => t.trim().toUpperCase())
        .filter(Boolean),
      timezone: c.timezone || "Europe/Paris",
    }));

  return NextResponse.json({ clients: out });
}
