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

## Deployment

- **Host**: Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Trigger**: Any push to `main` auto-deploys
- **Redirects**: Defined in `_redirects` file (SPA routing support)

## Code Conventions

- Use shadcn/ui components from `@/components/ui` for consistent styling
- Path alias `@` resolves to `src/` (configured in `vite.config.ts`)
- TypeScript strict mode enabled
- Tailwind classes for responsive design (mobile-first)
- React hooks over class components

## Contact Form Integration

The Contact form (src/pages/Contact.tsx) integrates with Formspree. The endpoint must be set in Contact.tsx—update the endpoint if needed or replace with alternative backend service.
