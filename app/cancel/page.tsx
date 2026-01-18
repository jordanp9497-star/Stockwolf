import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <main className="flex flex-col items-center justify-center text-center px-4 py-16 max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-zinc-100 mb-4">
          Paiement annulé
        </h1>
        <p className="text-lg text-zinc-400 mb-12">
          Vous pouvez réessayer quand vous voulez.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-zinc-100 text-zinc-950 px-8 py-3 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          Retour aux tarifs
        </Link>
      </main>
    </div>
  );
}
