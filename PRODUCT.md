# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Visitors** to kilninit.com: people browsing Chloe's ceramics portfolio (gallery, piece stories, about, contact).
- **Chloe (sole admin)**: a ceramicist who is just starting to sell. She uses the private Inventory admin, mostly on her phone, to manage her one-off handmade pieces and to record sales at a market stall, often one-handed, standing, with patchy attention and outdoor light. She is not technical.

## Product Purpose
The public site showcases finished pieces with their stories, materials and process. The private Inventory admin (`/admin`) is the master record of every piece Chloe has made and every sale: what exists, what it costs, where it went and for how much. Success: she can prep for a market, sell quickly at the stall, and see afterwards what sold, where and through which channel, without spreadsheets.

## Positioning
A shop manager in the spirit of Shopify or Etsy's store manager, but tailored to a single maker's unique handmade pieces. Items are individual objects (often one of a kind, sometimes a set sold together) grouped under designs/collections, not SKUs with stock counts. It is the master record and may later connect to other tools by API; for now it is custom and self-contained.

## Operating Context
- **Markets**: craft markets Chloe attends (first: 28 Nov 2026, goal €135). Per market: a packing list of pieces brought, fast sale recording at the stall, then results (earned vs goal, sold vs came home).
- **Other channels**: Instagram/DMs (shown as Online), friends and commissions (Direct), and later her own shop on kilninit.com.
- **Payment methods**: cash, Bizum, card, other. Currency EUR (Spain).
- Needs internet at the stall; every sale saves immediately.

## Capabilities and Constraints
- Stack: React + TypeScript + Vite, shadcn/ui, Tailwind, React Query; Supabase (Postgres + auth) for data; Netlify hosting. Schema changes deploy via the Supabase GitHub integration on merge to `main`; seed data is pasted manually.
- Single owner account; public sign-ups disabled; data readable only when signed in. Admin pages are `noindex` and not linked from the public nav.
- Photos: reuse portfolio photos only (via the design's `site_piece_id` → `src/data/pieces.ts` images); pieces without a portfolio entry get a placeholder. No photo uploads for now.
- Price only; no cost or profit tracking for now (may be added later).
- Terminology: **piece** (one sellable item or set), **design** (collection a piece belongs to), **market**, **sale**, **channel** (Market / Direct / Online).

## Brand Commitments
Name: "Kilnin' It with Chloe" / kilninit. Existing site palette: bright yellow primary, dusty mauve secondary, soft lilac accent, warm cream background; Playfair Display type. Warm, personal, handmade voice.

## Evidence on Hand
- Starting inventory: 20 designs, 46 pieces (`supabase/seed/market-2026-11-28.sql`); some counts are estimates marked "check".
- Portfolio pieces and photos in `src/data/pieces.ts` and `src/assets/`.
- No sales history yet. Do not fabricate sales, customers or figures.

## Product Principles
1. Selling at the stall must take seconds and be impossible to get wrong; undo is always one tap away.
2. One inventory is the source of truth; markets and channels are context on sales, never copies of pieces.
3. Mobile first: every task works one-handed on a phone; desktop is a bonus.
4. Plain language for a non-technical owner; no jargon in the UI.
5. Never lose data: changes save immediately and history is preserved.

## Accessibility & Inclusion
Readable outdoors on a phone: large tap targets, strong contrast, no reliance on colour alone for status.
