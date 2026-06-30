# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kilnin' It with Chloe** is a personal ceramics portfolio website showcasing ceramic pieces with detailed narratives, materials, techniques, and process stories. Built with React + TypeScript + Vite, deployed on Netlify with automatic CI/CD on pushes to main.

## Quick Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:8080)
npm run build           # Production build
npm run lint            # Run ESLint
npm test                # Run vitest once
npm test:watch          # Run vitest in watch mode (useful during development)
npm run preview         # Preview production build locally
```

## Project Architecture

### Core Structure
- **Pages** (`src/pages/`): Four main routes using React Router
  - `Index.tsx` — Gallery homepage with filtering
  - `PieceDetail.tsx` — Individual piece showcase with full story/process
  - `About.tsx` — Artist bio page
  - `Contact.tsx` — Contact form (uses Formspree)
  - `NotFound.tsx` — 404 page

- **Components** (`src/components/`): Reusable UI pieces
  - `Navbar.tsx`, `Footer.tsx` — Layout wrapper components
  - `FilterBar.tsx` — Gallery filtering controls (purpose/difficulty/technique)
  - `GalleryCard.tsx` — Individual piece card in gallery view
  - `ScrollReveal.tsx` — Animation wrapper for scroll-in effects
  - `ui/` — shadcn/ui components (generated; do not edit directly)

- **Data Model** (`src/data/pieces.ts`): Single source of truth for all portfolio content
  - Exports `Piece` interface and `pieces` array
  - Each piece contains: id, name, techniques, purpose, estimatedTime, images, story, materials, steps
  - Purpose filter: "Functional" | "Decorative" | "Sculptural" | "Lighting"
  - Difficulty filter: "Beginner" | "Intermediate" | "Advanced"
  - Techniques: "Hand-built" | "Wheel-thrown" | "Slab-building"

- **Hooks** (`src/hooks/`): Custom React hooks
  - `use-mobile.tsx` — Responsive breakpoint detection
  - `use-scroll-reveal.ts` — Intersection observer for animation triggers
  - `use-toast.ts` — Toast notification management

- **UI Library**: shadcn/ui components configured in `components.json` with Tailwind CSS + Radix UI primitives

### Key Dependencies
- **React Router** — Navigation between pages
- **React Query** — Data fetching/caching (configured in App.tsx)
- **Tailwind CSS** — Styling with DaisyUI-compatible color system
- **Sonner + custom toaster** — Toast notifications
- **embla-carousel-react** — Image carousels/galleries
- **react-hook-form + zod** — Form validation (Contact form uses Formspree API)

### Development Tools
- **Vite** — Fast build tool with HMR
- **TypeScript** — Full type safety
- **ESLint** — Code quality (no --fix by default; see eslint.config.js)
- **Vitest** — Unit testing with jsdom

## Content Management

To add or edit a ceramic piece:
1. Edit `src/data/pieces.ts`
2. Add entry to `pieces` array with required `Piece` interface fields
3. Import images at the top of the file (local assets go to `src/assets/`)
4. Populate story as array of paragraph strings for better formatting
5. Define all steps with title + description + optional note

The gallery auto-updates; filtering logic is in `FilterBar.tsx` and `Index.tsx`.

## Development Workflow

### Local Development
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally: `npm run dev`
3. Run linter & tests: `npm run lint && npm test`
4. Build locally to verify: `npm run build`
5. Commit and push to your branch
6. Create a pull request on GitHub

### GitHub Actions CI
Every push and PR automatically runs:
- Dependency installation (`npm ci`)
- Linting (`npm run lint`)
- Test suite (`npm test`)
- Production build (`npm run build`)

If CI passes, your PR is safe to merge. CI runs are visible as checks on the PR.

## Deployment

- **Host**: Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Config**: `netlify.toml` (explicit build settings, redirects, headers, cache rules)
- **Trigger**: Any push to `main` auto-deploys to production after GitHub Actions CI passes
- **Deploy Previews**: PRs automatically get preview URLs (when enabled in Netlify dashboard)

### Deployment Flow
```
Local (feature branch)
  ↓ git push
  ↓ GitHub (PR created)
  ↓ GitHub Actions (lint/test/build)
  ↓ If ✅, merge to main
  ↓ GitHub (push to main)
  ↓ Netlify (Build & Deploy)
  ↓ Live at https://kilninwithchloe.com
```

## Code Conventions

- Use shadcn/ui components from `@/components/ui` for consistent styling
- Path alias `@` resolves to `src/` (configured in `vite.config.ts`)
- TypeScript strict mode enabled
- Tailwind classes for responsive design (mobile-first)
- React hooks over class components

## Contact Form Integration

The Contact form (src/pages/Contact.tsx) integrates with Formspree. The endpoint must be set in Contact.tsx—update the endpoint if needed or replace with alternative backend service.

## Transition Notes (Lovable → Claude Code)

As of June 2026, this project has transitioned from Lovable.dev to Claude Code:

- ✅ Removed `lovable-tagger` plugin — no longer needed
- ✅ Deleted `.lovable/` directory — not used going forward
- ✅ Updated `index.html` branding — your site, not Lovable's
- ✅ Added **GitHub Actions CI** — automated lint/test/build checks
- ✅ Added **netlify.toml** — explicit Netlify configuration
- ✅ Project fully independent — all changes now via Claude Code + git

The codebase is clean, tested, and ready for ongoing development with Claude Code.
