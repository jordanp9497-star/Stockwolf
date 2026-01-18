import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache 5 minutes (300 secondes)

interface FMPNewsItem {
  symbol?: string;
  publishedDate: string;
  title: string;
  image?: string;
  site?: string;
  text?: string;
  url: string;
}

interface NormalizedNewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  symbol?: string;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
      console.error("[NEWS] MISSING_FMP_API_KEY: env var not set");
      return NextResponse.json(
        { ok: false, error: "MISSING_FMP_API_KEY" },
        { status: 500 }
      );
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const tickers = searchParams.get("tickers") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Build FMP API URL
    let apiUrl = `https://financialmodelingprep.com/api/v3/stock_news?apikey=${apiKey}`;
    
    if (tickers) {
      // FMP accepts tickers as comma-separated or individual query params
      apiUrl += `&tickers=${encodeURIComponent(tickers)}`;
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

    // Fetch news from FMP with timeout
    let newsRes: Response;
    try {
      newsRes = await fetchWithTimeout(apiUrl, 10000);
    } catch (e: any) {
      console.error("[NEWS] Fetch timeout/error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: e?.message === "FMP_API_TIMEOUT" ? "FMP_API_TIMEOUT" : "FETCH_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    if (!newsRes.ok) {
      let bodyPreview = "";
      try {
        const text = await newsRes.text();
        bodyPreview = text.substring(0, 200);
      } catch {
        bodyPreview = "Could not read response body";
      }
      console.error(`[NEWS] FMP_ERROR status=${newsRes.status}`, bodyPreview);
      return NextResponse.json(
        { ok: false, error: "FMP_ERROR", status: newsRes.status, bodyPreview },
        { status: 500 }
      );
    }

    let newsData: FMPNewsItem[];
    try {
      newsData = await newsRes.json();
    } catch (e: any) {
      console.error("[NEWS] JSON parse error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: "JSON_PARSE_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    // Normalize data
    const normalize = (item: FMPNewsItem): NormalizedNewsItem => ({
      title: item.title || "Sans titre",
      source: item.site || "FMP",
      publishedAt: item.publishedDate || new Date().toISOString(),
      url: item.url || "",
      symbol: item.symbol || undefined,
    });

    // Limit results and sort by date (newest first)
    const normalized = (newsData || [])
      .map(normalize)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return NextResponse.json(
      { ok: true, news: normalized },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e: any) {
    console.error("[NEWS] Unexpected error:", e?.message || String(e), e?.stack);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
