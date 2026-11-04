# Copilot Instructions

- Do not run `payload migrate`, `payload migrate:fresh`, `payload migrate:down`, `payload migrate:reset`, or `payload migrate:refresh` locally.
- Local development uses `pnpm dev`, which applies migrations automatically.
- If schema changes are needed, generate the migration with `pnpm exec payload migrate:create <name>` and commit the generated `.ts`, its `.json` snapshot and `src/migrations-postgres/index.ts`; let the dev server apply it.
