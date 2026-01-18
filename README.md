This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Test endpoint

Test the `/api/clients/active` endpoint:

```bash
curl -H "x-n8n-secret: TON_SECRET" http://localhost:3000/api/clients/active
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
SUPABASE_URL=PASTE_SUPABASE_PROJECT_URL_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE
N8N_SHARED_SECRET=CHANGE_ME_LONG_RANDOM_SECRET
STRIPE_SECRET_KEY=PASTE_HERE
STRIPE_WEBHOOK_SECRET=PASTE_HERE
PRICE_STOCKWOLF=price_xxx
PUBLIC_BASE_URL=http://localhost:3000
```

## Reload env

⚠️ **Important:** Next.js doit être redémarré après toute modification de `.env.local`.

Pour redémarrer le serveur de développement :
1. Appuyez sur `Ctrl+C` dans le terminal pour arrêter le serveur
2. Relancez avec `npm run dev`

Les variables d'environnement ne sont chargées qu'au démarrage du serveur.

## Stripe local test

Pour tester les webhooks Stripe en local :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Note:** Copiez le `STRIPE_WEBHOOK_SECRET` affiché par le CLI Stripe et ajoutez-le dans votre `.env.local`.

## Test endpoint checkout

Tester l'endpoint `/api/billing/checkout` avec PowerShell :

```powershell
curl -Method POST http://localhost:3000/api/billing/checkout `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{"email":"test@test.com","client_id":"test","client_name":"Test"}'
```

## Base de données Supabase

Exécuter ces requêtes SQL dans Supabase SQL Editor pour créer les tables nécessaires :

```sql
-- Table clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  digest_emails TEXT,
  urgent_emails TEXT,
  universe_tickers TEXT,
  timezone TEXT DEFAULT 'Europe/Paris',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
```
