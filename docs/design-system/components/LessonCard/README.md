# LessonCard

A lesson as a card with its image on Lessen: the image and time on top, title, coach, credit cost, spots and the booking action below.

**Consumer provides:** the `lesson` (`title`, `type`, `startDate`, `endDate`, `coaches`, `spots`, `image`, `template.image`), the free spots, this member's `lesson-enrollment` if any, and the member's credits for the lesson's period.

- **Image:** `lesson.image` → else `lesson.template.image` → else the fallback `lesson-fallback.webp` (Assets › Fallbacks: the dark glow) with the `SPORTLAB` wordmark as live text on top (`.fb`, `line-panel`). Use Payload image sizes (card 480×280, thumb 128×128), never the full upload. `alt=""`: the title next to it says what it is.
- `li.app-lcard` in `ul.app-lcards` (a grid, `minmax(220px, 1fr)`; one column on phones). `.app-media` (140px; 132px on phones) holds the image, `.sl-photo-overlay`, the type tag (`.app-tag.on-photo`: Personal training · Semi-personal training · Groepsles · Open gym) and `.app-lcard-time`: the start in Anton 40px white with "tot 19:30" in `sand`.
- `.app-lcard-body`: title (`h4`, 16/24 600), "met Noor · 1 groepscredit" (`text-muted`), the spots line, then `.app-lcard-act`.
- **Cost text:** `group` → "1 groepscredit" · `pt` and `semi_pt` → "1 PT-credit" · `open_gym` → "geen credit nodig" · waitlisted → "credit pas bij bevestigen". Past lessons show only "met Jesse".
- **States** (same words as LessonRow):

| State | When | Spots line | Action |
|---|---|---|---|
| Ingeschreven | enrollment `assigned` / `started` | "Gratis afmelden tot 18:25" (start − 5 min) | `.app-tag.ink` + `check` |
| Open | room left, credits left | "4 van 10 plekken vrij" | "Inschrijven" ghost |
| Geen credits | room left, 0 credits of that type in the lesson's period | free spots | `button.sl-btn.app-btn-off` disabled: "Geen PT-credits" / "Geen groepscredits" |
| Niet in abonnement | the member has no credits of that type | free spots | disabled: "Niet in abonnement" |
| Vol | no room | "Vol · 2 op de wachtlijst" | "Op wachtlijst" ghost |
| Op de wachtlijst | `waitlisted` | "Vol · jij bent 2e op de wachtlijst" | `.app-tag.line` "Wachtlijst · 2e" |
| Plek aangeboden | `waitlisted` + `waitlistNotifiedAt` | "Er is een plek voor je vrij" | "Bevestig plek" `sl-btn-ink` (disabled with "Geen credits" when none are left) |
| Gevolgd | `completed` | — | `.app-tag.line` + `check` "Gevolgd" |
| Afgelopen | past, not enrolled | — | "Afgelopen" in `text-muted` |

- No orange in a card. Tapping the card (outside the button) opens the lesson detail.
- **App, 60fps:** the list is a FlashList with a fixed item height per state; images via `expo-image` with the card size and caching; the overlay is one pre-rendered gradient image, the fallback one static file.
