# Copilot Instructions

- Do not run `payload migrate`, `payload migrate:fresh`, or `payload migrate:down` locally.
- Local development uses `pnpm dev`, which applies migrations automatically.
- If schema changes are needed, use the generation flow and let the dev server handle local migration application.
