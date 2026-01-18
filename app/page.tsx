"use client";

import Link from "next/link";
import { useRef } from "react";
import MarketMovers from "@/components/MarketMovers";
import NewsFeed from "@/components/NewsFeed";
import StockWolfIcon from "@/components/StockWolfLogo";

function StockWolfLogo() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/15 flex items-center justify-center bg-white/5 p-2">
            <StockWolfIcon />
          </div>
        </div>
        <span 
          className="text-xl font-bold text-zinc-100 tracking-tight"
          style={{ fontFamily: 'var(--font-sora)' }}
        >
          StockWolf
        </span>
      </div>
      <p className="text-[10px] text-zinc-500 ml-12 tracking-wide uppercase">IA & Tech • Market Intelligence</p>
    </div>
  );
}

function TickerTape() {
  const tickers = ["NVDA", "AMD", "MSFT", "GOOGL", "AMZN", "META", "TSM", "ASML", "AVGO"];
  const doubled = [...tickers, ...tickers];

  return (
    <div className="overflow-hidden bg-zinc-900 text-zinc-100 py-2 border-b border-zinc-800">
      <div className="flex animate-scroll whitespace-nowrap">
        {doubled.map((ticker, idx) => (
          <span key={idx} className="px-8 text-sm font-mono">
            {ticker} <span className="text-green-400">▲</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function scrollToSection() {
  const element = document.getElementById("comment-ca-marche");
  element?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ticker Tape */}
      <TickerTape />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <StockWolfLogo />
          </Link>
          <nav>
            <Link
              href="/pricing"
              className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
            >
              Accéder à l'agent
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div>
                <h1 className="text-2xl md:text-3xl font-medium text-zinc-100 mb-6 leading-relaxed max-w-3xl mx-auto">
                  Accès à votre agent IA boursier
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 mb-6">
                  StockWolf analyse, filtre et priorise l'information pour vous aider à suivre l'essentiel de vos secteurs et valeurs.
                </p>
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 bg-zinc-900 text-zinc-200 rounded-full text-sm font-medium border border-zinc-800">
                    Aujourd'hui disponible : Secteur IA/Tech
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/pricing"
                    className="inline-block bg-zinc-100 text-zinc-950 px-8 py-3 rounded-md font-medium hover:bg-zinc-200 transition-colors text-center"
                  >
                    Activer l'agent — 4,99€/mois
                  </Link>
                  <button
                    onClick={scrollToSection}
                    className="inline-block border border-zinc-700 text-zinc-200 px-8 py-3 rounded-md font-medium hover:bg-zinc-900/50 transition-colors text-center"
                  >
                    Découvrir l'agent
                  </button>
                </div>
              </div>

              {/* Right: Sample Digest Preview (Desktop only) */}
              <div className="hidden lg:block">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-6 max-w-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                      Aperçu du résumé
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-green-500 pl-3">
                        <p className="font-semibold text-zinc-100">TOP 5</p>
                        <p className="text-zinc-400">NVDA +2.4% — Nouveau partenariat annoncé</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <p className="font-semibold text-zinc-100">IPOs</p>
                        <p className="text-zinc-400">TechCorp dépose son S-1</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <p className="font-semibold text-zinc-100">8-K</p>
                        <p className="text-zinc-400">MSFT — Changement majeur de direction</p>
                      </div>
                      <div className="pt-2 text-xs text-zinc-500 italic">
                        Impact: Élevé | Confiance: 95%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 hover:shadow-lg hover:shadow-zinc-900/50 transition-shadow">
                <div className="text-3xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Sources primaires
                </h3>
                <p className="text-zinc-400">
                  SEC (8-K / 10-Q / 10-K / S-1) + IPO + News agrégées de sources fiables.
                </p>
              </div>
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 hover:shadow-lg hover:shadow-zinc-900/50 transition-shadow">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Filtrage intelligent
                </h3>
                <p className="text-zinc-400">
                  Les doublons disparaissent, les informations clés remontent en premier.
                </p>
              </div>
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 hover:shadow-lg hover:shadow-zinc-900/50 transition-shadow">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Scores de pertinence
                </h3>
                <p className="text-zinc-400">
                  Chaque news est classée selon impact, fiabilité et lien avec vos suivis.
                </p>
              </div>
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 hover:shadow-lg hover:shadow-zinc-900/50 transition-shadow">
                <div className="text-3xl mb-4">✉️</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Alertes & résumés
                </h3>
                <p className="text-zinc-400">
                  Recevez l'essentiel au bon moment, sans surcharge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is StockWolf Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-zinc-100 mb-6">
              Qu'est-ce que StockWolf ?
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Un workflow N8N complexe faisant travailler plusieurs API afin d'extraire les informations les plus pertinentes pour un investisseur de la tech.
            </p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-zinc-100 pl-6 py-4 bg-zinc-900/50 rounded-r-lg">
              <p className="text-lg md:text-xl text-zinc-200 italic leading-relaxed">
                "Quelle différence entre un investisseur pro et amateur ? La rapidité d'information. Ne soyez plus amateur, devenez le loup avec StockWolf."
              </p>
            </div>
          </div>
        </section>

        {/* Market Movers Section */}
        <MarketMovers />

        {/* News Feed Section */}
        <NewsFeed />

        {/* How it works Section */}
        <section id="comment-ca-marche" className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-zinc-100 text-center mb-12">
              Comment ça marche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Vous activez l'agent
                </h3>
                <p className="text-zinc-400">
                  Complétez votre profil en quelques minutes pour personnaliser l'agent selon vos secteurs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  L'agent analyse et filtre
                </h3>
                <p className="text-zinc-400">
                  Vous recevez l'essentiel : informations prioritaires, alertes utiles, résumés clairs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  Vous décidez avec plus de contexte
                </h3>
                <p className="text-zinc-400">
                  Moins de bruit, plus de temps pour analyser et agir sur les signaux importants.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-sm text-zinc-400">
          <p className="mb-2">Conçu pour vous aider à décider avec plus de contexte — pas pour vous donner des conseils d'investissement.</p>
          <p className="text-xs text-zinc-500">Info uniquement — pas un conseil financier.</p>
        </div>
      </footer>

    </div>
  );
}
