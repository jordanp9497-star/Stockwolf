import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Validates and normalizes a base URL to ensure it has an explicit scheme (https://).
 * Falls back through multiple env vars if needed.
 */
function requireHttpUrl(raw: string | undefined, name = "URL"): string {
  if (!raw || typeof raw !== "string") {
    throw new Error(`[CHECKOUT] Missing ${name}`);
  }
  const v = raw.trim();
  const withScheme = v.startsWith("http://") || v.startsWith("https://") 
    ? v 
    : `https://${v}`;
  
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    throw new Error(`[CHECKOUT] Invalid ${name}: "${raw}"`);
  }
  
  return u.toString().replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: "ENV_MISSING: STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const PRICE_ID = process.env.PRICE_STOCKWOLF;
    
    if (!PRICE_ID) {
      return NextResponse.json({ error: "ENV_MISSING: PRICE_STOCKWOLF" }, { status: 500 });
    }

    if (!/^price_[A-Za-z0-9]+$/.test(PRICE_ID)) {
      return NextResponse.json(
        { error: `ENV_INVALID: PRICE_STOCKWOLF must be a Stripe price id (price_...). got=${PRICE_ID}` },
        { status: 500 }
      );
    }

    // Get and validate SITE_URL with fallbacks
    let SITE_URL: string;
    try {
      const rawUrl = process.env.SITE_URL || 
                     process.env.APP_URL || 
                     process.env.FRONTEND_URL || 
                     process.env.NEXT_PUBLIC_SITE_URL ||
                     process.env.PUBLIC_BASE_URL; // Keep backward compatibility
      
      if (!rawUrl) {
        return NextResponse.json(
          { error: "ENV_MISSING: SITE_URL (or APP_URL/FRONTEND_URL/NEXT_PUBLIC_SITE_URL) must be set with full URL including https://" },
          { status: 500 }
        );
      }

      SITE_URL = requireHttpUrl(rawUrl, "SITE_URL");
    } catch (e: any) {
      console.error("[CHECKOUT] URL validation error:", e?.message || String(e));
      return NextResponse.json(
        { error: e?.message || "Invalid base URL configuration" },
        { status: 500 }
      );
    }

    console.log("[CHECKOUT] PRICE_STOCKWOLF =", process.env.PRICE_STOCKWOLF);
    console.log("[CHECKOUT] USING PRICE_ID =", PRICE_ID);
    console.log("[CHECKOUT] SITE_URL =", SITE_URL);

    const { email, client_id, client_name } = await req.json();
    if (!email || !client_id || !client_name) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const stripe = new Stripe(key);

    const successUrl = `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${SITE_URL}/cancel`;

    console.log("[CHECKOUT] success_url =", successUrl);
    console.log("[CHECKOUT] cancel_url =", cancelUrl);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { client_id, client_name, plan: "stockwolf_monthly", email },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    const msg = e?.message || "server_error";
    console.error("[CHECKOUT] error", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
