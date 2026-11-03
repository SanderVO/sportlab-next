# ProgramCard

A program on Overzicht and in Events: the member's active program with its progress, or an upcoming one to join.

**Consumer provides:** a `programs` doc (`title`, `startDate`, `endDate`, `bannerImage`, `description`, `finalEvent`) and, for an active one, the member's `program-enrollment` (status `active`), lessons attended and the final event's registration.

- **Active** (`.app-card`): eyebrow "Jouw programma", title, dates, the current week in Anton ("05" + "van 12 weken"; week = days since `startDate` / 7, rounded up), a 12-segment `.app-weeks` bar (`ink` done, `line` to go), facts (`.app-facts`: lessons attended, final event) and "Bekijk programma →".
- **Upcoming** (`.app-card.flush`): `.app-media` with the `bannerImage` (or the dark glow), a tag "Programma · 12 weken", "Start 5 januari" and the title on the photo; one line of description and "Bekijk programma" (ghost).
- The final event lives here, not again in the Events list.
- The bar is decorative next to the text ("05 van 12 weken"), so `role="img"` with an `aria-label`.
