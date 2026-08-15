# Design style guide for agents

This document is the agent-friendly summary of the brand styling source in `oNe More Reason.pdf`.

## Purpose

The PDF is the visual reference. This Markdown guide exists so agents can follow the styling rules without relying on a binary PDF during normal coding sessions.

When the PDF and implementation conflict, the PDF is the source of truth. If a styling decision is not obvious from the PDF, the project should stay aligned with the existing shared theme variables in [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>).

## Brand palette

Use the approved palette from the app theme:

- CTA orange: `#e8842b`
- CTA dark: `#d7741f`
- Ink: `#14110d`
- Charcoal: `#241e17`
- Sand: `#e8e0ce`
- Warm white: `#f6f2ea`
- Steel: `#46555f`
- Olive: `#5e5f47`

These values are already defined in [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>) and should be preferred over arbitrary color values.

## Typography

Use the existing font families defined in the theme:

- Montserrat: `--font-sl-montserrat`
- Open Sans: `--font-sl-open-sans`
- Bebas: `--font-sl-bebas`
- Anton: `--font-sl-anton`
- Archivo: `--font-sl-archivo`
- Poppins: `--font-sl-poppins`

The default app body styling uses Montserrat and a warm, high-contrast look.

## Button styling

Follow the established button patterns used in the app:

- Primary action: filled orange button with darker hover state
- Keep a rounded shape and strong contrast
- Prefer existing classes like `bg-cta`, `hover:bg-cta-dark`, `text-white`, `text-warm-white`, and `rounded-3xl`

This aligns with patterns already in use in [src/components/CookieBanner/CookieBanner.tsx](src/components/CookieBanner/CookieBanner.tsx) and shared UI variants in [src/lib/ui/variants.ts](src/lib/ui/variants.ts).

## Layout and spacing

- Keep layouts clean, spacious, and editorial.
- Prefer the existing breakpoints defined in [src/cssVariables.js](src/cssVariables.js).
- Do not invent custom spacing systems that conflict with the app’s current structure.

## Rules for AI-generated edits

1. Start from the existing theme tokens instead of hard-coded colors.
2. Preserve the warm brand identity defined by the PDF.
3. Reuse established component patterns before creating new ones.
4. Do not add off-brand neutrals, overly glossy effects, or generic SaaS styling.
5. If a required style is not yet represented in the theme, add it centrally and then use it consistently.

## Relevant files

- [src/app/(frontend)/globals.css](<src/app/(frontend)/globals.css>)
- [src/cssVariables.js](src/cssVariables.js)
- [src/lib/ui/variants.ts](src/lib/ui/variants.ts)
- [src/components/CookieBanner/CookieBanner.tsx](src/components/CookieBanner/CookieBanner.tsx)
