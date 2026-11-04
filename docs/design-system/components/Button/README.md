# Button

Pill buttons as on the existing Sportlab ads: the only place CTA orange appears.

**Consumer provides:** the label (short, imperative, Dutch: "Plan je gratis proefles", "Doe mee →", "Word lid") and the ground.

| Class | Ground | Use |
|---|---|---|
| `.sl-btn.sl-btn-cta` | any | THE action — one per piece. `cta` fill, `on-cta` (ink) label. |
| `.sl-btn.sl-btn-ghost-dark` | dark | Secondary on dark: 1px `white` outline. |
| `.sl-btn.sl-btn-sand` | dark | Secondary on dark, filled `sand`, `ink` label. |
| `.sl-btn.sl-btn-ink` | light | Secondary on light, `ink` fill, `white` label. |
| `.sl-btn.sl-btn-ghost-light` | light | Tertiary on light: 1px `ink` outline. |
| `.sl-link` | dark | Text link in `cta` with "→" ("Let’s talk goals →"). |

- Size: 45px tall, `space-22` side padding, `radius-pill`, Poppins 600 14px (`button`), sentence case.
- Focus: 2px `focus-ring` outline, 2px offset.
- Accessibility: the CTA label is `ink` on `cta` (6.96:1, WCAG AA). Never use white text on orange (2.7:1). The `.sl-link` text link is for dark grounds only (6.96:1 on ink); on light grounds use `.sl-btn-cta` instead.
- Don't: use orange for anything that isn't a button or link.
