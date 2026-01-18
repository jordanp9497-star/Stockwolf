import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache 5 minutes (300 secondes)

interface FinnhubNewsItem {
  category: string;
  datetime: number; // Unix timestamp
  headline: string;
  id: number;
  image?: string;
  related?: string;
  source?: string;
  summary?: string;
  url: string;
}

interface NormalizedNewsItem {
  title: string;
  source?: string;
  publishedAt: string; // ISO string
  url: string;
  summary?: string;
  image?: string;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      console.error("[NEWS] MISSING_FINNHUB_API_KEY: env var not set");
      return NextResponse.json(
        { ok: false, error: "MISSING_FINNHUB_API_KEY" },
        { status: 500 }
      );
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category") || "general";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

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
          throw new Error("FINNHUB_API_TIMEOUT");
        }
        throw e;
      }
    };

    // Build Finnhub API URL
    const apiUrl = `https://finnhub.io/api/v1/news?category=${encodeURIComponent(category)}&token=${apiKey}`;

    // Fetch news from Finnhub with timeout
    let newsRes: Response;
    try {
      newsRes = await fetchWithTimeout(apiUrl, 10000);
    } catch (e: any) {
      console.error("[NEWS] Fetch timeout/error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: e?.message === "FINNHUB_API_TIMEOUT" ? "FINNHUB_API_TIMEOUT" : "FETCH_ERROR", details: e?.message || String(e) },
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
      console.error(`[NEWS] FINNHUB_ERROR status=${newsRes.status}`, bodyPreview);
      return NextResponse.json(
        { ok: false, error: "FINNHUB_ERROR", status: newsRes.status, bodyPreview },
        { status: newsRes.status >= 500 ? 502 : newsRes.status }
      );
    }

    let newsData: FinnhubNewsItem[];
    try {
      newsData = await newsRes.json();
    } catch (e: any) {
      console.error("[NEWS] JSON parse error:", e?.message || String(e));
      return NextResponse.json(
        { ok: false, error: "JSON_PARSE_ERROR", details: e?.message || String(e) },
        { status: 500 }
      );
    }

    // Normalize data - convert Unix timestamp to ISO string
    const normalize = (item: FinnhubNewsItem): NormalizedNewsItem => {
      // Convert Unix timestamp (seconds) to ISO string
      const publishedAt = item.datetime 
        ? new Date(item.datetime * 1000).toISOString()
        : new Date().toISOString();

      return {
        title: item.headline || "Sans titre",
        source: item.source,
        publishedAt,
        url: item.url || "",
        summary: item.summary,
        image: item.image,
      };
    };

    // Limit results and sort by date (newest first)
    const normalized = (newsData || [])
      .map(normalize)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return NextResponse.json(
      { ok: true, items: normalized },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
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
