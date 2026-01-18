import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache 5 minutes (300 secondes)

interface AlphaVantageMover {
  ticker: string;
  price?: string;
  change_amount?: string;
  change_percentage?: string;
  volume?: string;
}

interface AlphaVantageResponse {
  metadata?: string;
  top_gainers?: AlphaVantageMover[];
  top_losers?: AlphaVantageMover[];
  most_actively_traded?: AlphaVantageMover[];
  Information?: string; // Rate limit message
  "Error Message"?: string; // Error message
  "Note"?: string; // Rate limit note
}

interface NormalizedMover {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      console.error("[MARKET_MOVERS] MISSING_ALPHAVANTAGE_API_KEY: env var not set");
      return NextResponse.json(
        { ok: false, error: "MISSING_ALPHAVANTAGE_API_KEY" },
        { status: 500 }
      );
    }

    // Timeout helper
    const fetchWithTimeout = async (url: string, timeoutMs: number = 10000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          next: { revalidate: 300 },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return res;
      } catch (e: any) {
        clearTimeout(timeoutId);
        if (e.name === "AbortError") {
          throw new Error("AV_API_TIMEOUT");
        }
        throw e;
      }
    };

    const apiUrl = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`;

    // Fetch from Alpha Vantage with timeout
    let avRes: Response;
    try {
      avRes = await fetchWithTimeout(apiUrl, 10000);
    } catch (e: any) {
      console.error("[MARKET_MOVERS] Fetch timeout/error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: e?.message === "AV_API_TIMEOUT" ? "AV_API_TIMEOUT" : "FETCH_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    let avData: AlphaVantageResponse;
    try {
      avData = await avRes.json();
    } catch (e: any) {
      console.error("[MARKET_MOVERS] JSON parse error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: "JSON_PARSE_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    // Check for Alpha Vantage errors/rate limits
    if (avData.Information || avData["Error Message"] || avData["Note"]) {
      const errorMsg = avData["Error Message"] || avData.Information || avData["Note"] || "Alpha Vantage API error";
      const bodyPreview = errorMsg.substring(0, 200);
      const statusCode = errorMsg.toLowerCase().includes("rate limit") || errorMsg.toLowerCase().includes("call frequency") ? 429 : 502;
      
      console.error(`[MARKET_MOVERS] AV_ERROR:`, bodyPreview);
      return NextResponse.json(
        { ok: false, error: "AV_ERROR", reason: errorMsg, bodyPreview },
        { status: statusCode }
      );
    }

    if (!avData.top_gainers || !avData.top_losers) {
      console.error("[MARKET_MOVERS] Invalid AV response structure:", Object.keys(avData));
      return NextResponse.json(
        { ok: false, error: "INVALID_RESPONSE", details: "Missing top_gainers or top_losers in response" },
        { status: 500 }
      );
    }

    // Normalize data - convert strings to numbers where possible
    const normalize = (item: AlphaVantageMover): NormalizedMover => {
      const parseNumber = (str: string | undefined): number | undefined => {
        if (!str) return undefined;
        const cleaned = String(str).replace(/[,$%+]/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? undefined : parsed;
      };

      const price = parseNumber(item.price);
      const change = parseNumber(item.change_amount);
      let changePercent = parseNumber(item.change_percentage);
      
      // If change_percentage has %, remove it before parsing
      if (item.change_percentage && typeof item.change_percentage === "string") {
        changePercent = parseNumber(item.change_percentage);
      }

      return {
        symbol: item.ticker || "",
        price,
        change,
        changePercent,
      };
    };

    const gainers = (avData.top_gainers || []).slice(0, 10).map(normalize);
    const losers = (avData.top_losers || []).slice(0, 10).map(normalize);

    const asOf = avData.metadata ? new Date().toISOString() : undefined;

    return NextResponse.json(
      { ok: true, gainers, losers, asOf },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      }
    );
  } catch (e: any) {
    console.error("[MARKET_MOVERS] Unexpected error:", e?.message || String(e), e?.stack);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
