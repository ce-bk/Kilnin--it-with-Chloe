# Kilnin' It with Chloe

Ceramics portfolio site ([kilninit.com](https://kilninit.com)) plus a private inventory admin for selling pieces at markets.

- **Public site:** gallery, piece stories, about, contact. Content lives in code (`src/data/pieces.ts`).
- **Admin (`/admin`, sign-in only):** every piece, its price and photo, events with a packing list and a stall Sell screen, sales, leads, and printable piece cards. Data lives in Supabase.

## Stack

React 18 + TypeScript, Vite, Tailwind CSS + shadcn/ui, React Router, React Query, Supabase (Postgres, auth, storage). Hosted on Netlify.

## Getting started

```bash
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm install
npm run dev                  # http://localhost:8080
```

Without `.env.local` the public site still works; the admin says it isn't connected.

`npm run lint`, `npm test` and `npm run build` are what CI runs on every push and pull request.

## Where things are

| Path | What |
|---|---|
| `src/pages/` | Public pages (gallery, piece detail, about, contact, privacy). |
| `src/components/` | Public site layout and gallery pieces. `ui/` is generated shadcn/ui, don't edit by hand. |
| `src/data/pieces.ts` | Portfolio content: every piece's story, materials, steps and photos (`src/assets/`). |
| `src/admin/` | The admin: `AdminApp.tsx` (sign-in, navigation, routes), one file per page, `data.ts` (all database reads and writes), `sheets.tsx` (bottom-sheet forms), `ui.tsx` (shared bits). |
| `src/lib/supabase.ts` | Supabase client and the database types. |
| `supabase/migrations/` | Database schema, in order. Applied automatically by the Supabase GitHub integration when merged to `main`. |
| `supabase/seed/` | The starting inventory (run once by hand, already applied). |
| `brand/` | Logo, stickers, Instagram highlight covers and the piece-card design. Not used by the site. |
| `PRODUCT.md` | Who the product is for, principles and terminology. |
| `CLAUDE.md` | Working notes for Claude Code. |

## Data and security

- The Supabase URL and publishable key are public by design; access is enforced in the database. Every table has row level security allowing only signed-in users, and public sign-ups are disabled, so the only user is the owner.
- Piece photos are in a private storage bucket (`piece-photos`) and shown through short-lived signed links.
- Never commit `.env.local` or any Supabase secret/service key. `pricing/` holds private notes and is git-ignored.

## Deploying

Merging to `main` deploys the site on Netlify and applies new database migrations. Pull requests get CI checks (and Netlify previews when enabled).
