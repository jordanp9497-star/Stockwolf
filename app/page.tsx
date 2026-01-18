"use client";

import Link from "next/link";
import { useRef } from "react";

function StockWolfLogo() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900"
            >
              <path
                d="M12 4c-2.5 0-4.5 2-4.5 4.5 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5S14.5 4 12 4zm0 7c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11 12 11z"
                fill="currentColor"
              />
              <path
                d="M9 8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S9 9.33 9 8.5zm4.5 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"
                fill="currentColor"
              />
              <path
                d="M10.5 12.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"
                fill="currentColor"
              />
              <path
                d="M12 14c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M7 6.5L5 8.5M17 6.5l2 2M7 15l-2-2M17 15l2-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>
        <span className="text-xl font-semibold text-gray-900">StockWolf</span>
      </div>
      <p className="text-xs text-gray-500 ml-10">IA/Tech Market Intel Digest</p>
    </div>
  );
}

function TickerTape() {
  const tickers = ["NVDA", "AMD", "MSFT", "GOOGL", "AMZN", "META", "TSM", "ASML", "AVGO"];
  const doubled = [...tickers, ...tickers];

  return (
    <div className="overflow-hidden bg-gray-900 text-white py-2 border-b border-gray-800">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ticker Tape */}
      <TickerTape />

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <StockWolfLogo />
          </Link>
          <nav>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Abonnement
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
                  Décuplez votre potentiel d'investisseur en ayant une longueur d'avance !
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6">
                  Grâce à StockWolf, soyez toujours à l'affût des nouvelles dans vos secteurs favoris !
                </p>
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                    Aujourd'hui disponible : Secteur IA/Tech
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/pricing"
                    className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors text-center"
                  >
                    S'abonner — 4,99€/mois
                  </Link>
                  <button
                    onClick={scrollToSection}
                    className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Voir comment ça marche
                  </button>
                </div>
              </div>

              {/* Right: Sample Digest Preview (Desktop only) */}
              <div className="hidden lg:block">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Aperçu d'un digest
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-green-500 pl-3">
                        <p className="font-semibold text-gray-900">TOP 5</p>
                        <p className="text-gray-600">NVDA +2.4% — Nouveau partenariat annoncé</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <p className="font-semibold text-gray-900">IPOs</p>
                        <p className="text-gray-600">TechCorp dépose son S-1</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <p className="font-semibold text-gray-900">8-K</p>
                        <p className="text-gray-600">MSFT — Changement majeur de direction</p>
                      </div>
                      <div className="pt-2 text-xs text-gray-500 italic">
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sources primaires
                </h3>
                <p className="text-gray-600">
                  SEC (8-K / 10-Q / 10-K / S-1) + IPO + News agrégées de sources fiables.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Dédup & scoring
                </h3>
                <p className="text-gray-600">
                  Déduplication automatique et scoring d'importance/confiance pour chaque item.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">✉️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Digest mail + alertes
                </h3>
                <p className="text-gray-600">
                  Digest email automatisé + alertes urgentes quand vraiment critique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is StockWolf Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Qu'est-ce que StockWolf ?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Un workflow N8N complexe faisant travailler plusieurs API afin d'extraire les informations les plus pertinentes pour un investisseur de la tech.
            </p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-gray-900 pl-6 py-4 bg-gray-50 rounded-r-lg">
              <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed">
                "Quelle différence entre un investisseur pro et amateur ? La rapidité d'information. Ne soyez plus amateur, devenez le loup avec StockWolf."
              </p>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="comment-ca-marche" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
              Comment ça marche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vous vous abonnez
                </h3>
                <p className="text-gray-600">
                  Choisissez votre abonnement et complétez votre profil en quelques minutes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vous recevez le digest par email
                </h3>
                <p className="text-gray-600">
                  Recevez régulièrement un digest automatisé avec les dernières nouvelles de vos secteurs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vous gardez une longueur d'avance
                </h3>
                <p className="text-gray-600">
                  Soyez informé en premier des opportunités et des tendances de marché.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>Info uniquement — pas un conseil financier.</p>
        </div>
      </footer>

    </div>
  );
}
