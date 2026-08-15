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
