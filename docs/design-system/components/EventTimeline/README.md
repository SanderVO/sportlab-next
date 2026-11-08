# EventTimeline

The upcoming events as a vertical timeline on a website page: a date on the left, one continuous line, the event's title and description, and square photos stepping between two lanes.

**Consumer provides:** the upcoming `events` (`title`, `description`, `eventType`, `bannerImage`, `startsAt`, `endsAt`), sorted by `startsAt`, plus the block's `title`, optional `subtitle` and `backgroundColor`. Fields: see `events` and the `eventTimeline` block in `data-schema.md`.

- **Upcoming only.** An event shows until `endsAt`, or `startsAt` when it has no end date. Past events are never listed. Pages are cached, so an event that passes after the page was rendered also has to disappear in the browser.
- **Header:** the title in `web-display` (Anton, uppercase; a short English title such as "Upcoming Events") and the subtitle in `web-lead`. On phones `web-display` steps down to 56px.
- **Date column (132px):** the day in `display-l` (Anton), the month in `web-meta` (uppercase), then weekday and time in `web-small`, `text-muted`: "do · 18:00". Dates use `nl-NL` in Europe/Amsterdam.
- **The line:** one continuous 1px line through every row, with a 9px dot at each event. `ink` on light grounds, `sand` on dark. Rows have no gap between them, so the line never breaks.
- **Content:** the title in `web-h2`, the description in `web-small`, then a Tag with the type: `running` Hardlopen · `hyrox` Hyrox · `special` Special. The description is optional; the row simply gets shorter.
- **Photos:** two 256px lanes on the right (200px below 1366px). The first event uses the outer lane, then they alternate, so the photos step down corner to corner. A photo stretches with its row and fills it (`object-fit: cover`, `radius-card`). Alt text comes from the media item.
- **No image:** the dark `panel-glow` → `charcoal` → `panel-deep` glow with the `SPORTLAB` wordmark in `line-panel`, like the lesson fallback.
- **No upcoming events:** the header stays, with one box: "Er staan nog geen evenementen gepland." and "Kijk binnenkort nog eens." `sand` on `warm-white`, `warm-white` on `sand`, `charcoal` on dark.
- **Grounds:** the block follows the page's Zwart, Beige or Wit setting. Zwart uses the `.sl-dark` glow with `text-on-panel` and `text-on-panel-muted`, never a flat fill.
- **Orange:** none. The timeline informs; the page's one action sits elsewhere.
- **Below 1024px:** one column. The line and dots run down the left edge. Each event stacks: day in `app-number` (40px) beside the month and time, the photo at 16:10, the title in `web-h3`, the description and the Tag.
