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
      return NextResponse.json(
        { error: "FMP_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Fetch gainers and losers in parallel
    const [gainersRes, losersRes] = await Promise.all([
      fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${apiKey}`,
        {
          next: { revalidate: 300 },
        }
      ),
      fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${apiKey}`,
        {
          next: { revalidate: 300 },
        }
      ),
    ]);

    if (!gainersRes.ok || !losersRes.ok) {
      return NextResponse.json(
        { error: "FMP API error", status: gainersRes.status },
        { status: 500 }
      );
    }

    const gainersData: FMPGainerLoser[] = await gainersRes.json();
    const losersData: FMPGainerLoser[] = await losersRes.json();

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
      { gainers, losers },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e: any) {
    console.error("[MARKET_MOVERS] Error:", e?.message || String(e));
    return NextResponse.json(
      { error: "SERVER_ERROR", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
