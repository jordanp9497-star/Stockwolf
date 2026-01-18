import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("ENV_MISSING: STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

async function upsertClientAndSubscription(params: {
  client_id: string;
  client_name: string;
  email: string;
  plan: string;
  status: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  current_period_end?: number | null;
}) {
  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .upsert(
      {
        client_id: params.client_id,
        client_name: params.client_name,
        digest_emails: params.email,
        urgent_emails: params.email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id" }
    )
    .select("id")
    .single();

  if (clientErr) throw new Error(clientErr.message);

  const { error: subErr } = await supabase
    .from("subscriptions")
    .upsert(
      {
        client_id: clientRow.id,
        stripe_customer_id: params.stripe_customer_id || null,
        stripe_subscription_id: params.stripe_subscription_id || null,
        stripe_price_id: params.stripe_price_id || null,
        plan: params.plan,
        status: params.status,
        current_period_end: params.current_period_end
          ? new Date(params.current_period_end * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    );

  if (subErr) throw new Error(subErr.message);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `webhook_error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const client_id = (session.metadata?.client_id || "").trim();
      const client_name = (session.metadata?.client_name || "").trim();
      const plan = (session.metadata?.plan || "stockwolf_monthly").trim();
      const email = (session.metadata?.email || session.customer_details?.email || "").trim();

      if (session.subscription && client_id && client_name && plan && email) {
        const sub = await stripe.subscriptions.retrieve(String(session.subscription));
        await upsertClientAndSubscription({
          client_id,
          client_name,
          email,
          plan,
          status: sub.status,
          stripe_customer_id: String(session.customer || ""),
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data?.[0]?.price?.id || null,
          current_period_end: sub.current_period_end || null,
        });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const { data: existing, error } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", sub.id)
        .single();

      if (!error && existing) {
        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            stripe_price_id: sub.items.data?.[0]?.price?.id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("[WEBHOOK] error", e?.message || e);
    return NextResponse.json({ error: e?.message || "server_error" }, { status: 500 });
  }
}
