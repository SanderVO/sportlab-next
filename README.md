# Sportlab

A website for Sportlab Groningen made in Next 15 and PayloadCMS. It deploys to Cloudflare Workers and works completely serverless.

## Development

Before you begin, you must generate some schema's and type files for correct typehinting. To do this, run the following command:

```bash
pnpm payload:generate
```

After that, you should make a `.env.local` and a `.env.production.local` file with env variables. For the production file, it should contain env variables for the preview deployment.

Then, to run the development server locally, run the following commands:

```bash
pnpm i
pnpm dev
```

To run a production build version of the application locally, run the following command:

```bash
pnpm dev:prod
```

## Cloudflare Preview

You can also deploy a preview version to Cloudflare to test the application in Worker environments and remote bindings. To do this, run the following command:

```bash
pnpm db:generate
pnpm deploy:database:preview
pnpm preview
```

This will setup a preview version of the application in Cloudflare Workers for you to test on, with the remote D1 preview database.
