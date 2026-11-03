# AGENTS

This repository's styling follows the **One More Reason** design system for Sportlab Groningen.

## Source of truth

- The design system artifact on claude.ai is the visual authority: https://claude.ai/code/artifact/b85d45fc-1044-491b-ab0c-827f00966109
- [docs/design-system/](docs/design-system/SNAPSHOT.md) is a read-only snapshot of the artifact, for tools that can't open it (OpenCode and other LLMs). Read `docs/design-system/README.md` for the brand rules and `docs/design-system/components/<Name>/README.md` per component before writing UI. The snapshot version is in [docs/design-system/SNAPSHOT.md](docs/design-system/SNAPSHOT.md). Never edit the snapshot by hand.
- If you can read the artifact (Claude Code, Claude on the web), read it instead of the snapshot: it is newer if they differ. Compare its `project/design-system.json` `lastChange.at` with the snapshot's, and if the snapshot is behind, refresh it (steps in `SNAPSHOT.md`) and flag that `sportlab-theme.css` may need a token update.
- If neither can be read, say so and flag that the result is unverified. The snapshot has the READMEs only, no `preview.html` files: they don't render outside the artifact and use `sl-*` / `app-*` classes that aren't in this repo.
- [src/app/(frontend)/sportlab-theme.css](<src/app/(frontend)/sportlab-theme.css>) is the only token layer in the repo: a hand-maintained Tailwind snapshot of the artifact's `tokens.json` (see its header for the `lastChange.at` it matches). When the artifact's tokens change, update this file by hand.
- [docs/style-guide.md](docs/style-guide.md) predates the design system. If it conflicts with the artifact, the artifact wins.

## Styling rules for AI-generated UI changes

1. **Use the tokens.** Never hard-code hex values, font sizes or spacing that exist as tokens. Colour utilities (`bg-ink`, `text-cta`, `bg-surface-card`, `text-text-on-panel-muted`, `border-line-tv`, `bg-orange-300`), spacing (`p-space-24`, `gap-tv-gap`), radii (`rounded-card`, `rounded-tv`, `rounded-pill`), fonts (`font-display`, `font-sans`, `font-label`) and type styles (`type-tv-body`, `type-display-l`, `type-eyebrow`) live in [src/app/(frontend)/sportlab-theme.css](<src/app/(frontend)/sportlab-theme.css>). If something is missing, propose adding it to the design system instead of inventing a value.
2. **Start from the design system's component.** Recreate it in React with Tailwind utilities and the tokens, following its README (and its `preview.html` when you can open the artifact). The `sl-*` / `tv-*` / `app-*` / `web-*` classes the READMEs mention are not in this repo: map them to the tokens instead of using the class names.
3. **Orange rule.** `cta` (#e8842b) is only for buttons and links, with `on-cta` (ink) text, never white. The one exception is `/tv`, which uses the orange family (`orange-200/300/700` and the ember glows) for details and keeps solid `cta` for the single action and the main block.
4. **Fonts.**
   - Anton (`font-display`) is for display text and is always uppercase.
   - Poppins (`font-sans`) is for body text, warm headings and buttons.
   - Archivo (`font-label`) is for the wordmark (`SPORTLAB`, 800, 0.25em tracking) and spaced-caps labels.
   - Never mix the roles.
5. **Contrast.** Every text/background pair must meet WCAG AA. Use `text-*` tokens on light grounds and `text-on-panel-*` tokens on dark.
6. **Focus.** Use the `focus-ring` outline: 2px on the web, 6px with a 6px offset on TV (`.tv-focusable`).
7. **Content stays as entered.** Content comes from Payload as written: Dutch UI copy in sentence case, English UPPERCASE campaign lines in Anton.
8. **No drop shadows, extra icon sets or emoji**, per the design system README.
9. **Keep changes minimal and intentional.** Favour consistency over novelty.

### `/tv` screens

- 1920×1080 and always dark: `.tv-screen.sl-dark`.
- Keep content inside the `tv-safe-x` / `tv-safe-y` safe area, and nothing smaller than 24px.
- Block accents alternate `.acc-ember` / `.acc-peach`, with `.acc-cta` for the main block.
- The current timer station is a `sand` fill.
- If content doesn't fit, split it over pages or columns instead of shrinking the type.

### Legacy tokens

[src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>) still carries tokens from before the design system, used by existing pages and components:

- `cta-dark` (hover state of `bg-cta` buttons)
- the `font-sl-*` families (Montserrat, Open Sans, Bebas, plus Anton, Archivo and Poppins aliases)
- the Montserrat body font and the charcoal page background

Don't use these in new design-system UI. Prefer the design-system equivalents, and migrate old usages when you touch them.

## Data schema in the design system

The design system carries the Payload data schema as `project/data-schema.md`, so new pages are designed around real fields. The repo copy is [docs/data-schema.md](docs/data-schema.md), generated from the Payload config (never edit it by hand).

On **every schema change** (a collection or global added, removed or renamed; a field added, removed or changed; a `payload.config.ts` collection list change), before finishing:

1. Run `pnpm generate:schema-doc` and include the updated `docs/data-schema.md` in the diff.
2. Publish it to the design system: read `project/data-schema.md` from the artifact (so you build on the live version), copy `docs/data-schema.md` over it under a scratch folder as `project/data-schema.md`, and publish with the Artifact tool (`url`: the design system artifact, `root`: that folder, `file_path`: the absolute path of the copy). Send only this file. Leave `project/design-system.json` alone: its `lastChange.at` is the token version that [sportlab-theme.css](<src/app/(frontend)/sportlab-theme.css>) snapshots, and a schema change is not a token change.
3. If the artifact can't be written, say so and flag that the design system's schema is out of date.

## Workflow

- Before changing styling, read the design system README and the relevant component README (from the artifact, or from `docs/design-system/` when you can't open it).
- Prefer the existing breakpoints in [src/cssVariables.js](src/cssVariables.js).
- Before finishing, grep your diff for raw hex codes and px font sizes that should be tokens, check orange usage and contrast, and on `/tv` check 1920×1080 for overflow and text under 24px.
- Mention which design-system version (`lastChange.at`, from the artifact or the snapshot) you built against, and which of the two it came from.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
