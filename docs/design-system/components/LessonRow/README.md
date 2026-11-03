# LessonRow

One lesson in a list (Overzicht, Lessen), with its booking state as the action on the right.

**Consumer provides:** the `lesson` (`title`, `type`, `startDate`, `endDate`, `coaches`, `spots`), the count of active enrollments and waitlisted members, this member's `lesson-enrollment` if any (`status`, `waitlistedAt`, `waitlistNotifiedAt`), and the member's credits for the lesson's period (see Credits).

On Lessen the same states are shown as LessonCard (with the lesson image); LessonRow stays the compact row for Overzicht.

- `li.app-lesson` in `ul.app-list`: date (`.app-date`: weekday in Archivo caps, day in Anton), time with `clock`, title + "type · coach", free spots, action. On phones the time and spots move under the title (`.mm`, `.ms`) and the row never wraps.
- **States and their action:**

| State | When | Right side |
|---|---|---|
| Ingeschreven | enrollment `assigned` / `started` | `.app-tag.ink` with `check` |
| Open | room left, no enrollment | "Inschrijven" `sl-btn-ghost-light` |
| Vol | no room, no enrollment | "Op wachtlijst" `sl-btn-ghost-light` → creates status `waitlisted` |
| Op de wachtlijst | status `waitlisted` | `.app-tag.line` "Wachtlijst · 2e" (place = order by `waitlistedAt`) |
| Plek aangeboden | `waitlisted` + `waitlistNotifiedAt` set | "Bevestig plek" `sl-btn-ink` (and the WaitlistNotice on top) |
| Geen credits | room left, 0 credits of the lesson's type in its period | disabled `sl-btn.app-btn-off` "Geen PT-credits" / "Geen groepscredits" |
| Niet in abonnement | the member has no credits of that type | disabled "Niet in abonnement" |

- Spots text: "5 van 10 plekken vrij", "Vol · 3 op de wachtlijst", "Vol · jij bent 2e op de wachtlijst", "Er is een plek voor je vrij". Free spots = `spots` − enrollments that aren't `cancelled` or `waitlisted`.
- Enrolled lessons show "Gratis afmelden tot 18:25" (start − 5 minutes) as the spots text; cancelling later keeps the credit used.
- Open gym needs no credit, so it is never "Geen credits".
- Buttons are 44px tall. Never orange in a row; on phones the card ends with the one orange "Les boeken" button.
