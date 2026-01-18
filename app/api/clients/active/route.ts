import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("ENV_MISSING: SUPABASE_URL");
  if (!key) throw new Error("ENV_MISSING: SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const expected = process.env.N8N_SHARED_SECRET;
    if (!expected) {
      return NextResponse.json({ error: "ENV_MISSING: N8N_SHARED_SECRET" }, { status: 500 });
    }

    const got = req.headers.get("x-n8n-secret") || "";
    if (got !== expected) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const supabase = getSupabase();

    // 1) récupère les abonnements actifs
    const { data: subs, error: subErr } = await supabase
      .from("subscriptions")
      .select("client_id,status")
      .in("status", ["active", "trialing"]);

    if (subErr) {
      return NextResponse.json({ error: "SUPABASE_SUBSCRIPTIONS_SELECT_FAILED", details: subErr.message }, { status: 500 });
    }

    const activeClientIds = (subs || []).map(s => s.client_id);
    if (activeClientIds.length === 0) {
      return NextResponse.json({ clients: [] }, { status: 200 });
    }

    // 2) récupère les clients correspondants
    const { data: clients, error: cErr } = await supabase
      .from("clients")
      .select("client_id,client_name,digest_emails,urgent_emails,universe_tickers,timezone")
      .in("id", activeClientIds);

    if (cErr) {
      return NextResponse.json({ error: "SUPABASE_CLIENTS_SELECT_FAILED", details: cErr.message }, { status: 500 });
    }

    const out = (clients || []).map(c => ({
      client_id: c.client_id,
      client_name: c.client_name,
      digest_emails: c.digest_emails,
      urgent_emails: c.urgent_emails,
      universeTickers: String(c.universe_tickers || "")
        .split(",")
        .map(s => s.trim().toUpperCase())
        .filter(Boolean),
      timezone: c.timezone || "Europe/Paris",
    }));

    return NextResponse.json({ clients: out }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
