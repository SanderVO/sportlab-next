# WeekStrip

The calendar on Lessen: one week as seven day buttons with a dot per lesson, and the chosen day's lessons below it.

**Consumer provides:** the week (Monday–Sunday, Europe/Amsterdam), the open `lessons` per day, which of them the member is enrolled in (`lesson-enrollments` assigned / started / completed), today, and the chosen day.

- `.app-week-hd`: the title ("Rooster" with "November 2026 · week 45" on web, "November · week 45" on phones) and `.nav` with two `.app-iconbtn` (Lucide `chevron-left` / `chevron-right`, `aria-label` "Vorige week" / "Volgende week"). Web adds a "Vandaag" ghost button.
- `.app-week` > seven `button.app-day`: the weekday (Archivo caps), the date in Anton, `.dots` (one `i` per lesson, max ~4; `i.mine` filled = the member's own lesson, empty = another lesson) and `.c` "3 lessen" (web only).
- **States:** `aria-pressed="true"` = the chosen day (`ink` fill, `sand` dots); `.today` = an `ink` outline; `.past` = the date in `text-muted`. Pressing a day only changes the list below; the URL keeps `?week=2026-W45&dag=di` so a refresh lands on the same day.
- Below it: `.app-dayhd` ("Dinsdag 3 november · vandaag" · "3 lessen"), then the day's LessonCards. An empty day shows `.app-dayempty`: "Geen lessen op deze dag." / "Kies een andere dag, of kijk in de volgende week."
- **Default day:** today; on Sunday evening or when today has no lessons left, the next day with lessons.
- **App:** swipe the strip sideways for the previous or next week (a paging horizontal list), the arrows stay for accessibility. Day buttons are at least 44px wide (`gap` 4px on a 390px screen).
