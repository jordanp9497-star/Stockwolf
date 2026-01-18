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
      return NextResponse.json(
        { error: "FMP_API_KEY not configured" },
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

    // Fetch news from FMP
    const newsRes = await fetch(apiUrl, {
      next: { revalidate: 300 },
    });

    if (!newsRes.ok) {
      return NextResponse.json(
        { error: "FMP API error", status: newsRes.status },
        { status: 500 }
      );
    }

    const newsData: FMPNewsItem[] = await newsRes.json();

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
      { news: normalized },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e: any) {
    console.error("[NEWS] Error:", e?.message || String(e));
    return NextResponse.json(
      { error: "SERVER_ERROR", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
