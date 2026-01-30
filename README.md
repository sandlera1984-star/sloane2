# Sloane Collective

A production-ready Next.js 15 subscription platform for exclusive photo/video content, built for Vercel.

## Tech Stack

- Next.js 15.5.9 (App Router) + React 19 + TypeScript
- Tailwind CSS (fashion palette: pinks, purples, whites, cream)
- Prisma + Postgres (Neon/Supabase)
- Auth: email/password (bcrypt) + secure cookie sessions
- Payments: Stripe subscriptions (CAD $5/month)
- Storage: Vercel Blob (private media + public thumbnails)
- Email: Resend

## Requirements

- Node.js **20.x**
- Postgres database
- Stripe, Resend, and Vercel Blob credentials

## Getting Started

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Troubleshooting npm install

If `npm install` fails with a 403 error in restricted environments, ensure your runner has access to the npm registry or configure an internal registry mirror in `.npmrc` before installing dependencies.

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID` (price set to CAD $5/month)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `APP_BASE_URL`

## Stripe Webhook Setup

1. Create a product + recurring CAD $5.00/month price in Stripe.
2. Add the price ID to `STRIPE_PRICE_ID`.
3. Configure a webhook endpoint:
   - URL: `https://<your-domain>/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Add the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## Vercel Blob

Uploads use the read/write token and private access for media files. Thumbnails are stored as public for previews. The API route `/api/media/[id]` checks for an active subscription before returning a short-lived signed URL.

## Notifications Flow

- Subscribers can opt-in/out on `/notifications`.
- Publishing a locked media item triggers email notifications with a 15-minute magic link.
- Magic links are single-use and invalidate after success.

## Admin

- `/admin` requires a user with `ADMIN` role in the database.
- Upload media, toggle locked/published states, and trigger notification emails.

## Deployment

Deploy on Vercel, configure environment variables, and ensure the database is reachable. Run Prisma migrations on the deployed database.

## Subscription Price

- CAD $5.00 / month recurring
