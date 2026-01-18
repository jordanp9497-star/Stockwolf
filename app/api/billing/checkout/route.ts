import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

console.log("[CHECKOUT] FILE =", __filename);

export async function POST(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "ENV_MISSING: STRIPE_SECRET_KEY" }, { status: 500 });

    const PRICE_ID = process.env.PRICE_STOCKWOLF;
    const BASE_URL = process.env.PUBLIC_BASE_URL;

    if (!PRICE_ID) {
      return NextResponse.json({ error: "ENV_MISSING: PRICE_STOCKWOLF" }, { status: 500 });
    }
    if (!BASE_URL) {
      return NextResponse.json({ error: "ENV_MISSING: PUBLIC_BASE_URL" }, { status: 500 });
    }

    if (!/^price_[A-Za-z0-9]+$/.test(PRICE_ID)) {
      return NextResponse.json(
        { error: `ENV_INVALID: PRICE_STOCKWOLF must be a Stripe price id (price_...). got=${PRICE_ID}` },
        { status: 500 }
      );
    }

    console.log("[CHECKOUT] PRICE_STOCKWOLF =", process.env.PRICE_STOCKWOLF);
    console.log("[CHECKOUT] USING PRICE_ID =", PRICE_ID);

    const { email, client_id, client_name } = await req.json();
    if (!email || !client_id || !client_name) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
      metadata: { client_id, client_name, plan: "stockwolf_monthly", email },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    const msg = e?.message || "server_error";
    console.error("[CHECKOUT] error", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
