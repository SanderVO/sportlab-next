# LessonThumb

The lesson's image as a small square with the date on top, used in the compact lists on Lessen: Ingeschreven and Gevolgde lessen.

**Consumer provides:** the lesson's date and image (same fallback chain as LessonCard), and for the row: the title, time, coach, credit cost or status.

- `.app-thumb` (56px; `.l` 64px in Gevolgde lessen; 52px on phones): the image (`object-fit: cover`) under a 50% `ink` shade, with the weekday (Archivo caps, `sand`) and the date (Anton, `white`) centred. `.dim` (78% shade) for cancelled lessons. No image → the fallback glow.
- **Ingeschreven** (`li.app-trow.s` in `ul.app-list`, grouped per week with `.app-eyebrow-row`: "Deze week" · "1 groepscredit"): thumb, title, "18:30 · Noor · 1 groepscredit" (waitlist: "nog geen credit"), then "Ingeschreven" (`ink` tag) or "Wachtlijst · 2e" (outline tag). Shows enrollments `assigned` and `waitlisted` with a future `startDate`, soonest first.
- **Gevolgde lessen** (`li.app-trow`, grouped per month): thumb, title, "07:00 · Groepsles · Noor", status with `check` or `x`, action.
  - "Gevolgd · 6 van 8 gelogd" → "Bekijk workout →" (on phones a `chevron-right` icon link with an `aria-label`).
  - Not everything logged → "Aanvullen" (ghost).
  - "Afgemeld · credit terug" (cancelled ≥ 5 min before the start) or "Te laat afgemeld · geen credit terug" (< 5 min) → no action.
- Newest first, 20 at a time, then "Toon oudere lessen" (ghost; on phones full width).
- On phones the status moves under the title (`.sm`) and the row never wraps.
