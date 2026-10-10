# AGENTS

This repository's styling follows the **One More Reason** design system for Sportlab Groningen.

## Source of truth

- The design system artifact on claude.ai is the visual authority: https://claude.ai/code/artifact/b85d45fc-1044-491b-ab0c-827f00966109
- The repo holds no copy of it. Read the artifact (`project/README.md` for the brand rules, `project/components/<Name>/README.md` and `preview.html` per component) before writing UI. If it can't be read, say so and flag that the result is unverified.
- [src/app/(frontend)/sportlab-theme.css](<src/app/(frontend)/sportlab-theme.css>) is the only token layer in the repo: a hand-maintained Tailwind snapshot of the artifact's `tokens.json` (see its header for the `lastChange.at` it matches). When the artifact's tokens change, update this file by hand.
- [docs/style-guide.md](docs/style-guide.md) predates the design system. If it conflicts with the artifact, the artifact wins.

## Styling rules for AI-generated UI changes

1. **Use the tokens.** Never hard-code hex values, font sizes or spacing that exist as tokens. Colour utilities (`bg-ink`, `text-cta`, `bg-surface-card`, `text-text-on-panel-muted`, `border-line-tv`, `bg-orange-300`), spacing (`p-space-24`, `gap-tv-gap`), radii (`rounded-card`, `rounded-tv`, `rounded-pill`), fonts (`font-display`, `font-sans`, `font-label`) and type styles (`type-tv-body`, `type-display-l`, `type-eyebrow`) live in [src/app/(frontend)/sportlab-theme.css](<src/app/(frontend)/sportlab-theme.css>). If something is missing, propose adding it to the design system instead of inventing a value.
2. **Start from the artifact's component.** Recreate its `preview.html` in React with Tailwind utilities and the tokens. The `sl-*` / `tv-*` classes are not in this repo.
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

## Workflow

- Before changing styling, read the artifact README and the relevant component README.
- Prefer the existing breakpoints in [src/cssVariables.js](src/cssVariables.js).
- Before finishing, grep your diff for raw hex codes and px font sizes that should be tokens, check orange usage and contrast, and on `/tv` check 1920×1080 for overflow and text under 24px.
- Mention which design-system version (`lastChange.at` from the artifact) you built against.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
