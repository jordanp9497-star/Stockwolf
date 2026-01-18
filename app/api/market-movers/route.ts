import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache 5 minutes (300 secondes)

interface FMPGainerLoser {
  symbol: string;
  name: string;
  change?: number;
  changesPercentage?: string | number;
  price: number;
}

interface NormalizedMover {
  ticker: string;
  name: string;
  changePercent: number;
  price: number;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
      console.error("[MARKET_MOVERS] MISSING_FMP_API_KEY: env var not set");
      return NextResponse.json(
        { ok: false, error: "MISSING_FMP_API_KEY" },
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
          throw new Error("FMP_API_TIMEOUT");
        }
        throw e;
      }
    };

    const gainersUrl = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${apiKey}`;
    const losersUrl = `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${apiKey}`;

    // Fetch gainers and losers in parallel with timeout
    let gainersRes: Response;
    let losersRes: Response;

    try {
      [gainersRes, losersRes] = await Promise.all([
        fetchWithTimeout(gainersUrl, 10000),
        fetchWithTimeout(losersUrl, 10000),
      ]);
    } catch (e: any) {
      console.error("[MARKET_MOVERS] Fetch timeout/error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: e?.message === "FMP_API_TIMEOUT" ? "FMP_API_TIMEOUT" : "FETCH_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    if (!gainersRes.ok || !losersRes.ok) {
      const status = gainersRes.ok ? losersRes.status : gainersRes.status;
      const failingRes = gainersRes.ok ? losersRes : gainersRes;
      let bodyPreview = "";
      try {
        const text = await failingRes.text();
        bodyPreview = text.substring(0, 200);
      } catch {
        bodyPreview = "Could not read response body";
      }
      console.error(`[MARKET_MOVERS] FMP_ERROR status=${status}`, bodyPreview);
      return NextResponse.json(
        { ok: false, error: "FMP_ERROR", status, bodyPreview },
        { status: 500 }
      );
    }

    let gainersData: FMPGainerLoser[];
    let losersData: FMPGainerLoser[];

    try {
      gainersData = await gainersRes.json();
      losersData = await losersRes.json();
    } catch (e: any) {
      console.error("[MARKET_MOVERS] JSON parse error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: "JSON_PARSE_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    // Normalize data - FMP returns changesPercentage as string like "+5.23%" or number
    const normalize = (item: FMPGainerLoser): NormalizedMover => {
      let changePercent = 0;
      if (item.changesPercentage) {
        const str = String(item.changesPercentage).replace("%", "").replace("+", "");
        const parsed = parseFloat(str);
        changePercent = isNaN(parsed) ? 0 : parsed;
      } else if (item.change !== undefined) {
        changePercent = item.change;
      }

      return {
        ticker: item.symbol || "",
        name: item.name || item.symbol || "",
        changePercent,
        price: item.price || 0,
      };
    };

    const gainers = (gainersData || []).slice(0, 10).map(normalize);
    const losers = (losersData || []).slice(0, 10).map(normalize);

    return NextResponse.json(
      { ok: true, gainers, losers },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
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
