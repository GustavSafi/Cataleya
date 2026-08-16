# Cattleya Labs API

Express backend replacing the Base44 SDK calls in the frontend: auth (register/OTP/login/reset),
loyalty accounts, lab result (COA) storage, file uploads, newsletter signups, and order
checkout (Zelle + crypto via Coinbase Commerce).

## Local development

```bash
cp .env.example .env
docker compose up -d        # starts local Postgres on :5432
npm install
npm run migrate             # creates tables
npm run dev                 # starts the API on :8080
```

By default `EMAIL_PROVIDER=console` and `STORAGE_PROVIDER=local`, so OTP emails are logged to
the terminal and uploaded files are written to `server/uploads/` — no Azure resources needed to
develop locally.

## Endpoints

| Method | Path                          | Auth | Notes |
|--------|-------------------------------|------|-------|
| POST   | /api/auth/register            | No   | Creates an unverified user, emails a 6-digit OTP |
| POST   | /api/auth/resend-otp           | No   | |
| POST   | /api/auth/verify-otp           | No   | Returns `{ access_token }` |
| POST   | /api/auth/login                | No   | Returns `{ access_token }` |
| GET    | /api/auth/me                   | Yes  | |
| POST   | /api/auth/forgot-password      | No   | Always returns 200 to avoid leaking which emails exist |
| POST   | /api/auth/reset-password       | No   | |
| GET    | /api/loyalty-accounts?user_id= | Yes  | User may only read/write their own account |
| POST   | /api/loyalty-accounts          | Yes  | |
| GET    | /api/lab-results?product_id=   | No   | Public, used to render COAs on product pages |
| POST   | /api/lab-results               | Admin only | For release 1, lab results are inserted directly into the `lab_results` table instead — this endpoint exists but isn't exercised by the UI flow |
| POST   | /api/upload                    | Yes  | multipart `file` field, returns `{ file_url }` |
| POST   | /api/newsletter/subscribe      | No   | Idempotent |
| GET    | /api/orders/payment-config     | No   | Returns the Zelle recipient info shown at checkout |
| POST   | /api/orders                    | No*  | Creates an order (guest checkout allowed). *Linked to the caller's account if a valid token is present |
| GET    | /api/orders/:id                | No   | Order id is an unguessable UUID, used as the confirmation/payment-instructions link |
| POST   | /api/orders/:id/crypto-checkout | No  | Creates a Coinbase Commerce charge (or a local stub in dev), returns `{ hosted_url }` |
| POST   | /api/orders/:id/card-checkout  | No   | Creates a hosted card-checkout session (or a local stub in dev), returns `{ hosted_url }` |
| POST   | /api/orders/:id/simulate-paid  | No   | Dev-only — marks an order paid without a real payment. 404s unless `CRYPTO_PROVIDER` is unset/stub |
| GET    | /api/orders/admin/list?status= | Admin | Lists orders (newest first, optional status filter) for the `/admin/orders` page |
| POST   | /api/orders/:id/mark-paid      | Admin | Manually confirm a payment (used for Zelle). Idempotent, emails the customer on the transition to paid |
| POST   | /api/forms/:type               | No   | Contact / wholesale / ambassador form submissions. Stored in `form_submissions` and emailed to `ADMIN_EMAIL` |
| GET    | /api/reviews?product_id=       | No   | Visible reviews for a product, newest first |
| POST   | /api/reviews                   | Yes  | Post a review (rating 1–5 + text). One per user per product; rate-limited |
| POST   | /api/webhooks/coinbase         | No   | Coinbase Commerce webhook, marks orders paid on `charge:confirmed`. HMAC-verified against `COINBASE_COMMERCE_WEBHOOK_SECRET` |

### Checkout payment methods

**Zelle** has no merchant API — there's no way to verify a Zelle payment automatically. The
checkout flow shows the customer your Zelle email/name and the order's short ID as a memo, then
the order sits in `pending_payment` until you see the money land and mark it paid. Do that from
the **`/admin/orders` page** (log in as an admin user, filter to Pending Payment, match by the
memo/short ID, click "Mark Paid" — this also emails the customer their confirmation). You can
still fall back to SQL if needed: `UPDATE orders SET status = 'paid' WHERE id = '...';`

**Crypto** goes through [Coinbase Commerce](https://commerce.coinbase.com/), which *does* confirm
automatically via webhook. Locally, with `CRYPTO_PROVIDER` unset (the default), checkout instead
redirects to a stub page at `/dev/crypto-stub/:id` in the frontend with a "Simulate Payment
Confirmed" button — this lets you exercise the entire order flow without a Coinbase account. To
go live: create a Coinbase Commerce account, set `CRYPTO_PROVIDER=coinbase`,
`COINBASE_COMMERCE_API_KEY` (Settings → API keys), and `COINBASE_COMMERCE_WEBHOOK_SECRET`
(Settings → Webhook subscriptions — point it at `<your-api-url>/api/webhooks/coinbase`).

**Cards** are implemented as a gateway-agnostic **hosted redirect** flow: the server creates a
payment session, the customer completes payment on the *gateway's own page*, and the gateway
confirms the result. Card details never touch this server, which keeps PCI scope at SAQ A —
**do not add raw card-number fields to the site.**

Taking cards needs three separate things, and a bank account alone is not enough:
1. a **bank account** (where funds settle),
2. a **merchant account** from an acquirer that permits this business type, and
3. a **payment gateway** (the API this code calls).

Until a gateway exists, `CARD_PROVIDER=stub` drives a local fake checkout page at
`/dev/card-stub/:id`, and — importantly — the card option is **automatically hidden whenever
`NODE_ENV=production`**, so a deployed site never offers customers a card option that cannot
take their money. The backend also rejects `payment_method: "card"` orders in that state, so
the guard holds even if the UI is bypassed.

To go live: obtain a merchant account + gateway, implement `createSessionViaGateway()` in
`src/lib/card-payments.js` for that provider (NMI, Authorize.net and Stripe all support the
hosted-redirect pattern already scaffolded), set `CARD_PROVIDER` plus the gateway credentials,
and add a webhook to mark orders paid. Note **Stripe's terms prohibit many research-chemical
businesses** — an offshore bank account does not change Stripe's own rules, so a high-risk-
friendly acquirer is the durable path. Google Pay / Apple Pay generally ride on top of
whichever card gateway you choose.

Order prices are currently trusted from the client (the shop's product list lives in the
frontend, there's no backend product catalog yet) — fine for a first release with manually
confirmed payments, but worth hardening with a server-side price catalog before this scales.

Google OAuth login is implemented but **commented out** in `src/routes/auth.js` — deferred to a
second release. To re-enable: uncomment the `/google` and `/google/callback` routes (and the
`jwt` import above them), uncomment the "Continue with Google" button + handler in the
frontend's `Login.jsx`/`Register.jsx` and `redirectToGoogle()` in `apiClient.js`, restore the
`/auth/callback` route in `App.jsx`, and set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` from
[Google Cloud Console](https://console.cloud.google.com/apis/credentials).

To promote a user to admin (so they can use the lab-results upload UI, gated by `role`), update
the database directly: `UPDATE users SET role = 'admin' WHERE email = '...';`

## Deploying to Azure App Service

1. Provision an Azure Database for PostgreSQL instance and run `npm run migrate` against it
   (point `DATABASE_URL` at it).
2. Provision Azure Communication Services (email) and an Azure Storage account (blob
   container for lab result files), then set `EMAIL_PROVIDER=acs`, `STORAGE_PROVIDER=azure`,
   and the corresponding connection strings/keys as App Service Application Settings.
3. Set `JWT_SECRET` to a long random value, `CORS_ORIGIN` to your deployed frontend URL, and
   `FRONTEND_URL` (used in password reset email links).
4. Deploy this `server/` folder as the App Service's deployment root, with `npm install` and
   `npm start` as the build/run commands (Node 18+ Linux runtime).
