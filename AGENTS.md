# AGENTS

This repository’s styling instructions are based on the visual design source in `oNe More Reason.pdf`.

## Source of truth

- The PDF is the visual authority for brand styling, spacing, typography, and UI patterns.
- The repository should treat the Markdown style guide in [docs/style-guide.md](docs/style-guide.md) as the agent-friendly working summary of that design.
- If the PDF and implementation differ, prefer the PDF and update the tokenized styles in the codebase to match it.

## Styling rules for AI-generated UI changes

When making or updating UI styling, agents must:

1. Use existing design tokens first.
    - Prefer the variables defined in [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>).
    - Prefer classes such as `bg-cta`, `bg-cta-dark`, `text-ink`, `text-warm-white`, `border-cta`, and the brand font classes.

2. Match the approved brand palette.
    - CTA orange: `#e8842b`
    - CTA dark: `#d7741f`
    - Ink: `#14110d`
    - Charcoal: `#241e17`
    - Sand: `#e8e0ce`
    - Warm white: `#f6f2ea`
    - Steel: `#46555f`
    - Olive: `#5e5f47`

3. Respect the visual language in the PDF.
    - Keep buttons and actions confident and high-contrast.
    - Preserve the warm, premium brand aesthetic rather than introducing generic neutral UI styles.
    - Avoid arbitrary colors, shadows, border radii, or spacing values that are not aligned with the approved design system.

4. Use layout and type conventions already established in the app.
    - Prefer the existing breakpoints in [src/cssVariables.js](src/cssVariables.js).
    - Prefer the existing font families configured in [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>).
    - Keep spacing and proportions consistent with the rest of the UI instead of inventing a new pattern.

5. Prefer tokenized updates over ad hoc styling.
    - If a new style is required, add it to the shared theme tokens first when it is clearly part of the approved brand system.
    - Avoid repeated one-off hex values spread across files.

6. Keep changes minimal and intentional.
    - Do not add decorative styling just because it looks modern if it is not in the approved design direction.
    - Favor consistency over novelty.

## Workflow

- Before changing styling, review both the PDF and the style guide summary.
- Implement the styling using the shared tokens and existing classes where possible.
- If a component is missing a style token that is clearly required by the design, add the token in the central theme file and then apply it consistently.

## Files to consult first

- [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>)
- [src/cssVariables.js](src/cssVariables.js)
- [docs/style-guide.md](docs/style-guide.md)

## Testing Cloudflare Worker bundle size

Cloudflare Workers has a 10MiB gzip limit on the deployed script. To check the current size:

1. `pnpm deploy:build` — runs `opennextjs-cloudflare build --env=production`, producing `.open-next/worker.js` and `.open-next/server-functions/default/`.
2. `pnpx wrangler deploy --dry-run --env production` — reports the real deploy size, e.g. `Total Upload: 45730.31 KiB / gzip: 10094.71 KiB`. This is the number to compare against the 10MiB limit.

Both commands need real filesystem/network access (wrangler writes to `~/Library/Preferences/.wrangler` and needs to reach Cloudflare), so in sandboxed environments run them with unsandboxed execution enabled.

To find what's contributing to size, parse esbuild's metafile instead of guessing:

```js
const meta = JSON.parse(
    fs.readFileSync(
        ".open-next/server-functions/default/handler.mjs.meta.json",
        "utf8",
    ),
);
const entries = Object.entries(meta.inputs)
    .map(([k, v]) => [k, v.bytes])
    .sort((a, b) => b[1] - a[1]);
```

Known findings so far (see `/memories/repo/worker-bundle-size.md` for full detail):

- `drizzle-kit` (~18MB) must stay excluded from Next's `outputFileTracingExcludes`; it's aliased away via a Turbopack `resolveAlias` stub for Cloudflare builds in [next.config.ts](next.config.ts) instead.
- Several ~2.7MB near-duplicate SSR chunks exist in the bundle. Merging the `(tv-dashboard)` and `(frontend)` route groups did **not** reduce this — the duplication isn't caused by separate route-group root layouts, so don't assume consolidating layouts will shrink the bundle without measuring first.
