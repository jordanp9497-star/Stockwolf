import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="flex flex-col items-center justify-center text-center px-4 py-16 max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Paiement confirmé ✅
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Vous recevrez votre digest dès le prochain envoi.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Retour à l'abonnement
        </Link>
      </main>
    </div>
  );
}
