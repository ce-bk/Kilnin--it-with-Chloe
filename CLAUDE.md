# CLAUDE.md

Guidance for Claude Code in this repository. Start with `README.md` (project map) and `PRODUCT.md` (users, principles, terminology).

## Commands

```bash
npm run dev         # dev server, http://localhost:8080
npm run lint        # ESLint
npm test            # Vitest once (npm run test:watch to watch)
npm run build       # production build
```

Run lint, test and build before committing; CI runs the same on every push and PR.

## Two halves

1. **Public portfolio** (`src/pages`, `src/components`, `src/data/pieces.ts`). Content is code: to add a piece, add an entry to `pieces` in `src/data/pieces.ts` with its images imported from `src/assets/`. Story is an array of paragraphs; steps have title, description and optional note.
2. **Inventory admin** (`/admin`, `src/admin`). Mobile-first shop manager for one maker. Backed by Supabase.
   - All reads/writes go through hooks in `src/admin/data.ts` (React Query). Pages get everything via `useAdminData()` as props (`AdminData`).
   - Forms are bottom sheets in `src/admin/sheets.tsx`.
   - Pieces (`items`) belong to a `category`, may link to a portfolio piece (`site_piece_id`) for a fallback photo, and have a `quantity` (identical units; each sale is one unit).
   - Events are stored in the `markets` table (packing list in `market_items`); sales point at a market or use the Direct/Online channel.
   - Database triggers keep `items.status` in step with sales; don't set status to sold from the app.

## Database changes

- Add a new file in `supabase/migrations/` named `YYYYMMDDHHMMSS_name.sql`; never edit an applied migration. They apply on merge to `main` via the Supabase GitHub integration, so new columns don't exist in production until then.
- Every new table needs row level security, an `authenticated` policy, and `revoke all ... from anon`.
- Update the types in `src/lib/supabase.ts` to match.

## Conventions

- shadcn/ui from `@/components/ui` (generated, don't edit). `@` is `src/`.
- Tailwind, mobile-first. TypeScript strict. Function components and hooks.
- The admin's look is its own theme (`.admin-theme` in `src/index.css`); fonts are Playfair Display (titles) and Hanken Grotesk (everything else).
- Plain, non-technical wording in the admin UI.

## Local only, never commit

`.env.local`, `pricing/` (private pricing notes), `.claude/`, `.impeccable/`, and the admin preview harness (`preview.html`, `preview-frame.html`, `src/admin/__preview.tsx`, `src/admin/__mock.json`, excluded via `.git/info/exclude`). Open `http://localhost:8080/preview.html?p=/admin/pieces` to try the admin with sample data and no database.

## Deployment

Netlify builds `npm run build` and publishes `dist` on every push to `main` (`netlify.toml` has redirects, security headers and caching). The Formspree endpoint for the contact form is set in `src/pages/Contact.tsx`.
