# TvSchedule

The /tv day overview for the gym TVs: today's classes as big rows you can read from across the room and open with the remote.

**Consumer provides:** the date (`?date=YYYY-MM-DD`), and per class: start time, class name (e.g. "Conditioning - Aerobic Engine"), the session title ("Conditioning Groningen"), coach ("Lieuwe van der Bijl"), category ("Groepslessen"), status ("Open") and the link to `/tv/<id>`.

- Frame: `.tv-screen.sl-dark`, 1920×1080, padding `tv-safe-y` / `tv-safe-x`. Top bar: `SPORTLAB` wordmark (32px) and a live clock (`tv-heading` size). The clock is an addition; the website doesn't show one.
- Date block: eyebrow "VANDAAG" in `sand`, date in `tv-title` ("MAANDAG 12 OKTOBER"), year and class count in `tv-body`. The day arrows ‹ › are 96px round `.tv-nav` buttons.
- Rows: `.tv-class` on `charcoal`, `radius-tv`. Columns: time (`tv-time` 104px plus a short date), name (`tv-heading`) with meta in `tv-body`, a `.tv-status` pill, and "→". Rows are 40px apart (`tv-gap`).
- **1–3 classes:** full-width rows as above.
- **4–6 classes (6 is the maximum per day):** switch to the dense layout, `.tv-classes-dense` with `.tv-class.dense` cards in a 2×3 grid.
  - The grid fills column by column, so the morning is on the left and the afternoon/evening on the right.
  - The date block shrinks to one line: the eyebrow carries the class count ("VANDAAG · GROEPSLESSEN · 6 LESSEN") and the title drops to 96px.
  - Each card shows the time (76px) and short date on the left. On the right is the class name at 44px on one line, and under it the 'Open' pill plus the session title and coach on one line, truncated with "…" if too long.
  - The text never goes below 24px. Keep class names short in Payload: about 26 characters fit at full size.
- **Calendar button:** "Kalender" sits next to the ‹ › day arrows as a 96px ghost pill (`.tv-btn-ghost`) with a line calendar icon (`.tv-icon`, 40px, `currentColor`). This is the only icon on the TV screens; it's drawn as a simple monochrome line, as the Iconography rules ask.
- **Calendar picker:** OK on "Kalender" opens a month view in the modal pattern (`.tv-modal.tv-cal-modal` over `.tv-scrim`, `role="dialog"`).
  - Header: "KIES EEN DAG" eyebrow, the month in `tv-title` and ‹ › to change month.
  - Grid: `.tv-cal`, Monday first, with weekday labels MA–ZO.
  - Day cells: `.tv-day`, 104px tall in Anton 48px.
  - States: `.today` gets an `orange-300` outline. `.sel` (the focused/selected day) gets a solid `cta` fill with ink text, plus the focus ring. `.has` shows an `orange-300` dot when that day has classes. `.out` is a day outside the month, shown dimmed.
  - Right panel: the selected date, its class count and up to 4 times with names. Then "Toon dag →" (the one `cta` action), "Vandaag" and "Sluiten".
  - Remote: arrows move day by day, OK selects, Back closes.
- Remote: rows, arrows and the calendar button get `.tv-focusable`. Focus is a 6px `focus-ring` outline. Left/right changes the day, up/down moves between rows, OK opens the workout or the calendar.
- Colour: orange tints only. Each row gets `.acc-ember` or `.acc-peach` (alternating, or one per category), which colours the 6px top bar. The date under the time is `orange-300`, 'Open' is an `orange-700` pill with white text and an `orange-300` dot, the arrow is `sand`, and the campaign line in the footer is `orange-200`.
- Solid orange appears only on the selected day and the "Toon dag" button in the calendar. The overview itself has no call to action, only navigation.
- The class names, times and dots in the 6-class and calendar examples are sample data. The website currently shows 2 classes on 12 October.
