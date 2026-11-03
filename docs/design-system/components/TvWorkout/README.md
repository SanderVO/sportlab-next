# TvWorkout

The /tv/[id] workout screen: the whole session plan on one TV, every block visible at once, no scrolling.

**Consumer provides:** session title ("Conditioning Groningen" / "Performance cyclus winter"), class name, coach, date and time, an optional header photo, and the blocks. Each block has a title, a format line (e.g. "EMOM 10 minutes (RPE 7)", "AMRAP 24 min", "3 rondes"), a duration, optional POA's (points of attention), and exercises with a quantity and an optional cue.

- Header: wordmark, the "← Terug naar overzicht" ghost button (`.tv-btn-ghost`, focusable) and the clock. The class name is in `tv-title` with a `sand` eyebrow above it (session · date · time) and the coach, block count and total time in `tv-body`.
- Header photo: the workout's photo sits behind the top-right of the screen (1000×460), masked with a radial fade so it melts into the glow background and the title keeps full contrast. The preview uses `group-class-in-action.jpg`. Without a photo, leave the glow background on its own.
- Blocks: `.tv-block` cards on `charcoal`. Each card shows a number ("01") in `text-on-panel-eyebrow`, the title in `tv-block-title`, a `.tv-dur` duration pill (top right) and the format line in `sand`. Exercises are `.tv-ex` rows split by `line-tv`: the name in `tv-exercise`, the quantity right-aligned in `text-on-panel-muted`, and the cue underneath in `tv-cue`.
- Layout by block count: 1–3 blocks in a row of columns (wider for longer blocks, e.g. 1fr / 1.25fr). 4–5 blocks use five equal columns with `.tv-ex.compact` (28px, never smaller; the quantity follows the name inline and the cue goes underneath). 6 or more: split the session over two pages instead of shrinking the type.
- Colour: orange tints only. Alternate `.acc-ember` and `.acc-peach` per block, and use `.acc-cta` for the main block (e.g. Strength). The accent colours the 6px top bar, the number, the format line and the filled duration pill. POA boxes get a faint orange tint.
- Remote: each block is `.tv-focusable`. OK on a block opens TvBlockTimer.
- Copy stays exactly as the trainer wrote it in Payload (Dutch/English mix, "Rust", "p/k"). Only "x" is set as "×".
