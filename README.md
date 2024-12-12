# E2B Dashboard

Modern dashboard application built with Next.js and Supabase.

## Tech Stack

- **Framework**: Next.js with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth (cookie-based)
- **UI**:
  - Tailwind CSS for styling
  - shadcn/ui for component library
  - Storybook for component development
- **Type Safety**: TypeScript + Zod

## Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
# Option 1: Check src/lib/env.ts for required environment variables
# and create .env.local file with appropriate values

# Option 2: If using vercel cli, pull environment variables:
vercel env pull .env.local
```

3. Development commands:

```bash
# Start development server
pnpm dev

# Database operations
pnpm db:push     # Push schema changes
pnpm db:generate # Generate Drizzle schema
pnpm db:migrate  # Run migrations
pnpm db:studio   # Open Drizzle Studio

# UI Development
pnpm storybook   # Launch Storybook
pnpm shad        # Add shadcn/ui components
```

## Contributing

1. Create a new branch from `main`
2. Make your changes
3. Submit a PR for review

> Before building, the application runs environment checks via `prebuild` script
