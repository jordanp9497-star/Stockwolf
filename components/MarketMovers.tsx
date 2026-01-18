"use client";

import { useState, useEffect } from "react";

interface Mover {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

interface MarketMoversData {
  gainers: Mover[];
  losers: Mover[];
}

export default function MarketMovers() {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">("gainers");
  const [data, setData] = useState<MarketMoversData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/market-movers");
      const json = await res.json();
      
      if (!res.ok || json.ok === false) {
        // Handle structured error response
        let errorMsg = "Erreur lors du chargement des données";
        if (json.error === "MISSING_ALPHAVANTAGE_API_KEY") {
          errorMsg = "Clé API manquante côté serveur";
        } else if (json.error === "AV_ERROR") {
          errorMsg = json.reason?.toLowerCase().includes("rate limit") || json.reason?.toLowerCase().includes("call frequency")
            ? "Limite API atteinte, réessaie plus tard"
            : `Erreur API Alpha Vantage: ${json.reason || "Erreur inconnue"}`;
        } else if (json.error === "AV_API_TIMEOUT") {
          errorMsg = "Timeout lors de l'appel API (10s dépassés)";
        } else if (json.error === "FETCH_ERROR") {
          errorMsg = `Erreur réseau: ${json.details || "connexion échouée"}`;
        } else if (json.error) {
          errorMsg = `Erreur API (${json.status || json.error})`;
        }
        setError(errorMsg);
        console.error("[MarketMovers] API Error:", json);
        return;
      }
      
      setData(json);
    } catch (e: any) {
      const errorMsg = e?.message || "Erreur inattendue";
      setError(errorMsg);
      console.error("[MarketMovers] Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  const renderMoverRow = (mover: Mover, isGainer: boolean) => {
    const colorClass = isGainer
      ? "border-green-500/30 bg-green-500/10"
      : "border-red-500/30 bg-red-500/10";
    const textColorClass = isGainer ? "text-green-400" : "text-red-400";
    const arrow = isGainer ? "▲" : "▼";
    const changePercent = mover.changePercent ?? 0;

    return (
      <div
        key={mover.symbol}
        className={`flex items-center justify-between p-3 rounded-lg border ${colorClass} hover:bg-opacity-20 transition-colors`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-zinc-100 font-mono">
              {mover.symbol}
            </span>
            <span className={`text-sm font-medium ${textColorClass}`}>
              {arrow} {formatPercent(changePercent)}
            </span>
          </div>
          {mover.name && (
            <p className="text-xs text-zinc-400 truncate">{mover.name}</p>
          )}
        </div>
        {mover.price !== undefined && (
          <div className="ml-4 text-right">
            <p className="text-sm font-semibold text-zinc-200">
              {formatPrice(mover.price)}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-zinc-100 text-center mb-8">
            Trends du jour
          </h2>
          <div className="text-center text-zinc-400">Chargement...</div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-zinc-100 text-center mb-8">
            Trends du jour
          </h2>
          <div className="text-center text-zinc-400 text-sm mb-4">
            {error || "Données indisponibles"}
          </div>
          {error && (
            <div className="text-center">
              <button
                onClick={fetchData}
                className="inline-block border border-zinc-700 text-zinc-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-900/50 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const currentData = activeTab === "gainers" ? data.gainers : data.losers;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-zinc-100 text-center mb-8">
          Trends du jour
        </h2>

        {/* Tabs - Mobile & Desktop */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`flex-1 sm:flex-initial px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "gainers"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Top Hausses
          </button>
          <button
            onClick={() => setActiveTab("losers")}
            className={`flex-1 sm:flex-initial px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "losers"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Top Baisses
          </button>
        </div>

        {/* Desktop: 2 columns side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Gainers Column */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span>Top Hausses</span>
              <span className="text-green-500">▲</span>
            </h3>
            <div className="space-y-2">
              {data.gainers.slice(0, 10).map((mover) =>
                renderMoverRow(mover, true)
              )}
            </div>
          </div>

          {/* Losers Column */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span>Top Baisses</span>
              <span className="text-red-500">▼</span>
            </h3>
            <div className="space-y-2">
              {data.losers.slice(0, 10).map((mover) =>
                renderMoverRow(mover, false)
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Single column with active tab */}
        <div className="lg:hidden">
          <div className="space-y-2">
            {currentData.map((mover) =>
              renderMoverRow(mover, activeTab === "gainers")
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
