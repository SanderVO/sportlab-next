# TvBlockTimer

The block modal on the TV: one workout block full-screen, with up to 8 exercises and a big timer the whole room can read.

**Consumer provides:** the block (title, format, duration, exercises, POA's), its position ("Blok 1 / 2") and the workout name, plus the timer state: mode (EMOM, AMRAP, rounds or plain countdown), remaining time, elapsed/total, the current minute or round, and whether it's running or paused.

- Structure: `.tv-scrim` over the workout, then `.tv-modal.tv-block-modal` (`role="dialog"`, `aria-modal="true"`). Inset 48/80px so the TV's edges stay clear. The modal uses the warm glow gradient, `radius-tv`, and a 3px `line-tv` edge.
- Layout (`.tv-block-modal`, two columns `1fr` / 760px, three rows):
  - `.hd` (left, row 1): `sand` eyebrow (block n / total · workout name), block title in `tv-title`, format in `tv-meta` in the accent colour. Eyebrow and title stay on one line and end in an ellipsis when too long.
  - `.left` (left, row 2): the timer, progress bar and context line, vertically centred.
  - `.right` (right, rows 1–2): `.tv-stations-head` (count label in `tv-eyebrow` + the `tv-clock`), then the `ol.tv-stations` list. The list runs the full height of the modal down to the footer.
  - `.ft` (full width, row 3): the buttons, then either a key hint (`.tv-eyebrow.hint`) or the POA note (`.tv-poa`) on the right.
- Stations: **up to 8 rows without scrolling.** Each `.tv-station` is 64px tall with a 6px gap. The type is the same as before: exercise text Poppins 600 36px/44px, the number (`b`: "Min 4", "10", "200m") Anton 36px in a 120px column. Put the exercise name in `.ex` so a long name ends in an ellipsis; an extra label goes in `.tag` (right-aligned).
  - **More than 8:** don't shrink the type and don't scroll. Page the list per 8 and keep the page that holds the current station on screen; show the range in the head label ("Stations 9–12 / 12").
- Timer: `tv-timer` (Anton 300px, tabular numerals) in `white`, readable at 8 m+. Underneath: a `.tv-progress` bar (`sand` on a `line-tv` track) and the context line.
  - **EMOM:** the time left in this minute, "Minuut 4 / 16" and "Totaal 03:18 / 16:00". The station list highlights the current minute (`.tv-station.now`: `sand` fill, `ink` text, 12.6:1) and outlines the next one (`.next`, labelled "Hierna" in `.tag`).
  - **AMRAP:** total time left, plus a round counter (`.tv-rounds`, a rounded square echoing the "+1 rep counter" sticker) and, for "Elke ronde wisselend", the current alternating movement. The "Wisselend per ronde" POA sits in the footer, so the list keeps its full height.
- Controls: one orange CTA (`.tv-btn-cta` "Pauze" / "Start"). This is the only orange on screen, in line with the brand's CTA rule. Secondary actions are `.tv-btn-ghost`: "Opnieuw", "+1 Ronde", "Sluiten". Each is 96px tall and focusable for the remote (6px `focus-ring`).
- Remote: OK = pause/start, ‹ › = previous/next block, Back = close. Proposed final 10 seconds of an interval: keep the timer white and turn the progress bar fully `sand`. Don't flash and don't use orange.
- Colour: the modal takes the block's accent (`.acc-ember` for EMOM 'Machine wheel', `.acc-peach` for AMRAP 'Circuit', matching the block on the workout screen). The accent colours the format line, the labels, the minute numbers, the progress bar (`orange-700` → the tint), the 'Hierna' outline and the round counter. The background uses the same ember glow gradient as the screens. The Pauze/Start button stays solid `cta`.
- Labels like "Deze minuut · nog", "Resterend", "Hierna", "+1 Ronde" and "8 stations" are proposals; the website's modal copy wasn't available.
