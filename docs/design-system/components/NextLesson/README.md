# NextLesson

The dark "Volgende les" panel at the top of Overzicht: the one thing a member needs to know first.

**Consumer provides:** the member's next `lesson-enrollment` (status `assigned`, `lesson.startDate` in the future): the lesson's `title`, `type`, `startDate`/`endDate`, `coaches` (name + `avatar`) and `workoutBlocks` (`name`, `timerMode`, `duration`); or nothing.

- `.app-panel.sl-dark`: eyebrow "Volgende les · morgen" (relative day: vandaag, morgen, or the weekday), an "Ingeschreven" tag (`.app-tag.on-dark`), the start time in `app-time` (Anton 104px, 72px on phones), the date and end time, the title in `app-panel-title`, the coach with avatar (initial on `sand` when there's no photo).
- **Workout blocks:** up to three in `.app-blocks` (a row of outlined boxes on web, a list on phones): name, timer mode and minutes ("EMOM · 16 min"). More than three: show the first two and "+2 blokken".
- **Buttons:** "Bekijk workout" (`sl-btn-sand`) and "Afmelden" (`sl-btn-ghost-dark`). No orange inside the panel.
- **No lesson planned:** the same panel with "Nog geen les gepland.", one line and "Bekijk lessen" (sand). A brand-new member gets the MemberHomeNew hero instead.
- Lesson type labels: `pt` Personal training · `semi_pt` Semi-personal training · `group` Groepsles · `open_gym` Open gym.
- App: render the glow as one pre-rendered image behind the panel; the panel itself is flat.
