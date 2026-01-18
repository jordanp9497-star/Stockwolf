"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  symbol?: string;
}

interface NewsData {
  news: NewsItem[];
}

export default function NewsFeed() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Optionally filter by tech tickers: ?tickers=NVDA,AMD,MSFT,GOOGL,AMZN,META
        const res = await fetch("/api/news?limit=12");
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Error loading news");
        console.error("[NewsFeed] Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays}j`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-zinc-100 mb-2">
              Actualités
            </h2>
            <p className="text-zinc-400">
              Les dernières nouvelles boursières en temps réel
            </p>
          </div>
          <div className="text-center text-zinc-400">Chargement...</div>
        </div>
      </section>
    );
  }

  if (error || !data || !data.news || data.news.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-zinc-100 mb-2">
              Actualités
            </h2>
            <p className="text-zinc-400">
              Les dernières nouvelles boursières en temps réel
            </p>
          </div>
          <div className="text-center text-zinc-400 text-sm">
            {error || "Aucune actualité disponible"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-zinc-100 mb-2">
            Actualités
          </h2>
          <p className="text-zinc-400">
            Les dernières nouvelles boursières en temps réel
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {data.news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-50 line-clamp-2 flex-1">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mt-3">
                <span className="truncate">{item.source}</span>
                <span className="ml-2 whitespace-nowrap">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              {item.symbol && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs rounded font-mono">
                  {item.symbol}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Optional: "Voir plus" button - can link to /news page later */}
        <div className="text-center">
          <button
            onClick={() => {
              // TODO: Navigate to /news page when implemented
              window.open(
                "https://site.financialmodelingprep.com/stock-news",
                "_blank"
              );
            }}
            className="inline-block border border-zinc-700 text-zinc-200 px-6 py-2 rounded-md text-sm font-medium hover:bg-zinc-900/50 transition-colors"
          >
            Voir plus d'actualités
          </button>
        </div>
      </div>
    </section>
  );
}
