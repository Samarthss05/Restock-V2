# ReStock by Ledger

An interactive prototype of **ReStock by Ledger** — a B2B procurement marketplace
where shops post requests for quotation, verified suppliers bid anonymously, and
Ledger escrows payment end-to-end. Built with Next.js (App Router), TypeScript,
and Tailwind CSS v4, styled as a self-contained iOS-style device frame.

## What's in here

- **Shop workspace**: Home, Create RFQ (manual / AI chat-import / AI photo-scan),
  Product Search, Live Bidding, Order Tracking (with an AI dispute co-pilot),
  Orders, Account.
- **Supplier workspace**: Home (AI win-likelihood ranking), RFQ Inbox, Submit Bid
  (AI suggested pricing, AI-suggested substitutions, contact-info moderation),
  Orders, Account.
- A conversational **Ask ReStock AI** assistant on both sides, backed by
  keyword-matched responses over the live in-session data (`src/lib/assistant.ts`).
- All data is mock/in-session (see [Scope](#scope) below) and persisted to
  `localStorage` so a refresh — or closing and reopening the tab — doesn't lose
  your place.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The device frame fills the
viewport on phone-sized screens and renders as a centered mockup on wider ones.

**Demo accounts** — the login screen routes by email, no password check:
- Shop: `hello@tanjongfresh.sg` (prefilled default)
- Supplier: `hello@goldenharvest.sg`

## Deploying

This is a standard Next.js app with no environment variables, no database, and
no external API keys — it deploys with zero configuration.

**Vercel (recommended):**
1. Go to [vercel.com/new](https://vercel.com/new) and import
   `samarthss05/restock-v2` from GitHub.
2. Leave all settings on their defaults (Framework Preset: Next.js).
3. Click **Deploy**. That's it — no environment variables to add.

Any other Next.js-compatible host (Netlify, Cloudflare Pages, a plain Node
server via `npm run build && npm run start`) works the same way.

## Scope

This is a design/product prototype, not a production system:
- All data lives in React state, persisted client-side to `localStorage` —
  there's no server, database, or multi-user sync. Clearing site data (or
  using a different browser/device) resets it to the seed dataset.
- Login has no real authentication — it exists to route between the Shop and
  Supplier workspace.
- "AI" features (chat parsing, photo-scan, pricing/dispute/ranking
  recommendations, the assistant) are deterministic simulations (regex/rules
  over local data), not calls to a real model or backend.
- No real payments, escrow, or messaging integration.

See the codebase's design doc context for the full product spec this
prototype implements.
