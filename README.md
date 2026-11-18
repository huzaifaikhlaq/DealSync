# DealSync

DealSync project foundation built with Next.js App Router, TypeScript, Tailwind CSS, and Prisma.

## Requirements

- Node.js 22 or later
- pnpm 11 (enabled through Corepack)
- Docker Desktop for the local app and PostgreSQL containers

## Local setup

Copy `.env.example` to `.env` and set a local PostgreSQL password if desired. Compose uses the `postgres` service hostname inside Docker. For commands run on the host, use `localhost` as the database hostname instead.

Start the app and PostgreSQL:

```sh
docker compose up -d --build
```

The app is available at <http://localhost:3000>. PostgreSQL is bound to `127.0.0.1:5432` and persists data in a named Docker volume.

For host-based development, install dependencies and start Next.js with:

```sh
pnpm install
pnpm dev
```

Prisma configuration reads `DATABASE_URL`. Generate the client with `pnpm db:generate`; create development migrations with `pnpm db:migrate` after models are added. Migrations and seed data are not run automatically.

## Production

Vercel should build and run the Next.js application natively. Set `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` in the Vercel project environment. Use the managed PostgreSQL provider's connection string. The Dockerfile is provided for portable container hosting and is not intended for Vercel deployment.
