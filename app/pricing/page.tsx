"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function StockWolfLogo() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-100 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-zinc-100"
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
        <span className="text-xl font-semibold text-zinc-100">StockWolf</span>
      </div>
      <p className="text-xs text-zinc-400 ml-10">IA/Tech Market Intel Digest</p>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientName) {
      setClientId(slugify(clientName));
    }
  }, [clientName]);

  const handleCheckout = async () => {
    if (!email || !clientId || !clientName) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, client_id: clientId, client_name: clientName }),
      });

      const raw = await res.text();
      console.log("[CHECKOUT] status=", res.status);
      console.log("[CHECKOUT] raw response=", raw);

      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error("Le serveur a renvoyé du HTML/texte au lieu de JSON. Voir console (raw response).");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Erreur checkout");
      }

      if (!data?.url) {
        throw new Error("Réponse Stripe invalide: url manquante");
      }

      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <StockWolfLogo />
          </Link>
          <nav>
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
            >
              Accueil
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-semibold text-zinc-100 mb-4">
              Abonnement
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Accédez à notre veille boursière IA/Tech automatisée
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            <div className="border border-zinc-800 rounded-lg p-8 bg-zinc-900 shadow-xl hover:shadow-2xl hover:shadow-zinc-900/50 transition-shadow">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                  Accès mailing StockWolf
                </h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-zinc-100">
                    4,99€
                  </span>
                  <span className="text-zinc-400 ml-2">/mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="text-zinc-300 flex items-start">
                  <span className="text-zinc-500 mr-2">•</span>
                  <span>Veille SEC (8-K / 10-Q / 10-K / S-1) + News</span>
                </li>
                <li className="text-zinc-300 flex items-start">
                  <span className="text-zinc-500 mr-2">•</span>
                  <span>Résumé IA: impact, importance, confiance</span>
                </li>
                <li className="text-zinc-300 flex items-start">
                  <span className="text-zinc-500 mr-2">•</span>
                  <span>Digest email + alertes (quand vraiment critique)</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 italic">
                  Info uniquement — pas un conseil financier.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-md mx-auto p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Vos informations
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-950 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:border-transparent placeholder:text-zinc-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-950 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:border-transparent placeholder:text-zinc-500"
                  placeholder="Nom de votre organisation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Identifiant (slug) *
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-950 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:border-transparent placeholder:text-zinc-500"
                  placeholder="mon-identifiant"
                  required
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Généré automatiquement depuis le nom (éditable)
                </p>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-900/50 rounded-md text-red-300 text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 py-3 px-6 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
            >
              {loading ? "Redirection..." : "S'abonner"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
