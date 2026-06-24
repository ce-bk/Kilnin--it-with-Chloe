# Kilnin' It with Chloe

Personal ceramics portfolio site built with React, Vite, and Tailwind CSS. Hosted on Netlify.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Deployed via Netlify

## Local development

You'll need Node.js installed. Then:

```bash
npm install
npm run dev
```

## Deploying

Any push to `main` triggers an automatic deploy on Netlify.

Build command: `npm run build`  
Publish directory: `dist`

## Structure

```
src/
  assets/       # Images and media
  components/   # Shared UI components
  pages/        # One file per page (Index, About, Contact, PieceDetail)
  data/         # pieces.ts — all portfolio content lives here
```

## Updating content

To add or edit a ceramic piece, update `src/data/pieces.ts`. Each piece has a title, description, images, and metadata.

## Contact form

The contact form uses Formspree. The endpoint is set in `src/pages/Contact.tsx`.
