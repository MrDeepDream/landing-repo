# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Payload CMS 3.62 + Next.js 15 platform with PostgreSQL (Neon). Block-based page builder with bilingual content (Ukrainian `uk` default, English `en`). Deployed on Vercel with Blob storage for media.

## Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build (8GB heap)
npm run type-check       # TypeScript strict check (tsc --noEmit)
npm run lint             # ESLint on src/
npm run lint:fix         # ESLint with auto-fix
npm run generate:types   # Regenerate payload-types.ts from collections/globals
npm run generate:importmap # Regenerate Payload admin import map
npm run seed             # Seed demo bilingual content
npm run seed:fresh       # Wipe DB + seed
npm run create-admin     # Create admin user (admin@example.com)
```

No test runner is configured. Pre-commit hooks (Husky) run `type-check`, `eslint --fix`, and `prettier --write` on staged files — commits are blocked on errors.

## Architecture

### Route Groups

- `src/app/(app)/` — Frontend. All routes use `[locale]` segment (`/uk/...`, `/en/...`).
- `src/app/(payload)/` — Payload admin panel (`/admin`) and API routes (`/api`, `/api/graphql`).

### Data Flow

1. **Collections** (`src/collections/`) define Payload data models: `Pages`, `News`, `Navigation`, `Users`, `Media`, `NewsTags`.
2. **Globals** (`src/globals/`) define site-wide singletons: `SiteSettings`, `Footer`, `MediaFolders`.
3. **`src/lib/payload-data.ts`** — All data fetching functions. Every query takes `locale` and `draft` params. Uses `React.cache()` for request deduplication. This is the single source of truth for how data is queried from Payload.
4. **`src/lib/payload.ts`** — `getPayload()` singleton accessor.
5. **`payload-types.ts`** (project root) — Auto-generated types. Run `npm run generate:types` after changing collections/globals.

### Block System

Pages and News use a blocks array for content. The rendering pipeline:

- `src/components/RenderBlocks.tsx` — Maps `blockType` string to React component via switch statement. This is the central dispatcher — add new block types here.
- Block components live in `src/components/*Block.tsx` (e.g., `HeroBlock.tsx`, `FAQBlock.tsx`).
- Block type interfaces are defined inline in `RenderBlocks.tsx`, not in a shared types file.
- Currently 19 block types: heroBlock, featuresBlock, testimonialsBlock, statsBlock, timelineBlock, pricingBlock, teamBlock, faqBlock, logoCloudBlock, videoBlock, caseStudyBlock, comparisonBlock, sectionHeader, markdownText, imageBlock, callToAction, personPlaceBlock, accordionBlock, tabBlock, mediaBlock.

### Localization

- Payload config: `locales: [uk, en]`, `defaultLocale: 'uk'`, `fallback: true`.
- Collection fields marked `localized: true` store separate values per locale.
- Slugs are auto-generated with Cyrillic transliteration (`src/lib/transliterate.ts`).
- Root `page.tsx` redirects to `/en`. The `[locale]` layout fetches site data per locale.

### Live Preview & Draft Mode

- Next.js `draftMode()` enables preview of unpublished content.
- `LivePreviewPage.tsx` and `LivePreviewNews.tsx` use `@payloadcms/live-preview-react` for real-time CMS editing.
- ISR revalidation is set to 60 seconds. `generateStaticParams()` pre-builds slug routes.

### Styling

- Tailwind CSS with CSS custom properties for theming (HSL color tokens in `globals.css`).
- shadcn/ui components in `src/components/ui/`.
- Custom `e-Ukraine` font family loaded from `src/fonts/`.
- `motion/react` for animations (Framer Motion API).

## Key Patterns

- **Server components by default.** Only add `'use client'` for interactive components.
- **Relationship fields** return `string | Object` depending on query depth. Always check: `typeof field === 'object' ? (field as Media) : null`.
- **Null coalescing** for optional Payload fields: `block.title || ''`, `block.subtitle ?? undefined`.
- **Access control** in collections: published content is public; draft content requires admin auth.
- **Connection pooling**: PostgreSQL pool is capped at 10 connections (Neon free tier).

## Environment Variables

Required: `DATABASE_URI`, `PAYLOAD_SECRET` (min 32 chars), `NEXT_PUBLIC_SERVER_URL`.
Optional: `BLOB_READ_WRITE_TOKEN` (Vercel Blob), `CORS_ORIGINS`.

## Access Points

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- REST API: http://localhost:3000/api
- GraphQL: http://localhost:3000/api/graphql
