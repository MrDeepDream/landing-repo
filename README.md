# Payload Platform

Modern content management platform built with Next.js 15, React 19, and Payload CMS 3.62. Features trilingual content (Ukrainian/English/Spanish), block-based pages, and PostgreSQL database.

## Tech Stack

- **Next.js 15** - App Router, Server Components
- **Payload CMS 3.62** - Headless CMS with admin panel
- **PostgreSQL** - Database (Neon serverless PostgreSQL recommended for deployment)
- **TypeScript** - Strict mode enabled
- **Tailwind CSS** + **shadcn/ui** - Styling and components

## Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL database (local or Neon)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and set DATABASE_URI and PAYLOAD_SECRET

# 3. Start dev server
npm run dev
```

First run automatically creates database tables.

Access points:

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- REST API: http://localhost:3000/api
- GraphQL: http://localhost:3000/api/graphql

## Scripts

| Command                  | Description                           |
| ------------------------ | ------------------------------------- |
| `npm run dev`            | Start dev server                      |
| `npm run build`          | Production build                      |
| `npm run start`          | Start production server               |
| `npm run create-admin`   | Create admin user (admin@example.com) |
| `npm run seed`           | Seed demo bilingual content           |
| `npm run seed:fresh`     | Cleanup database + seed in one step   |
| `npm run generate:types` | Regenerate TypeScript types           |
| `npm run lint`           | Run ESLint                            |
| `npm run type-check`     | TypeScript checking                   |

## Pre-commit Hooks

This project uses Husky + lint-staged for automatic code quality checks before commits:

- **TypeScript** - Full project type-check
- **ESLint** - Auto-fix on staged files (blocks on errors/warnings)
- **Prettier** - Auto-format staged files

Commits are blocked if any check fails. Hooks are installed automatically via `npm install`.

## Environment Variables

Required in `.env`:

```env
DATABASE_URI=postgresql://user:password@host:5432/database?sslmode=require
PAYLOAD_SECRET=your-secret-key-min-32-characters
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

For Neon PostgreSQL:

```env
DATABASE_URI=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Project Structure

```
src/
├── app/(app)/          # Frontend routes with [locale] segments
├── app/(payload)/      # Admin panel and API routes
├── collections/        # Payload data models (Users, Media, Pages, News, etc.)
├── globals/            # Site-wide settings
├── components/         # React components (ui/, blocks, etc.)
├── fields/             # Custom Payload admin fields
└── lib/                # Utilities (payload.ts, utils.ts, seo.ts, sanitize.ts)
```

## Collections

- **Users** - Authentication with role-based access (admin/user)
- **Media** - File uploads with auto-resizing
- **Pages** - Block-based dynamic pages
- **News** - Articles with drafts, versioning, tags
- **Navigation** - Multi-level site navigation
- **NewsTags** - Color-coded categorization

## Deployment

### Vercel + Neon (Recommended)

1. Create a [Neon](https://neon.tech) PostgreSQL database (free tier available)
2. Deploy to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard

**Build:** `npm run build`
**Start:** `npm run start`

Required env vars: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `NODE_ENV=production`

### Connection Pooling

The project is configured with connection pooling optimized for Neon free tier:

- Max 10 connections
- 30s idle timeout
- 10s connection timeout

## Documentation

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)
