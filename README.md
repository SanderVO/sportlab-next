# Sportlab

A website for Sportlab Groningen made in Next 16 and PayloadCMS. It is built as a Docker image (see `Dockerfile`) and runs on Postgres.

## Development

Before you begin, you must generate some schema's and type files for correct typehinting. To do this, run the following command:

```bash
pnpm payload:generate
```

After that, you should make a `.env.local` and a `.env.production.local` file with env variables.

Then, to run the development server locally, run the following commands:

```bash
pnpm i
pnpm dev
```

To run a production build version of the application locally, run the following command:

```bash
pnpm dev:prod
```

## Importing from Cloudflare D1

To import the production Cloudflare D1 data into Postgres, see `scripts/import-d1-to-postgres.ts` (`pnpm payload:import:d1 --help`). It exports the D1 database with Wrangler (configured in `wrangler.jsonc`).
