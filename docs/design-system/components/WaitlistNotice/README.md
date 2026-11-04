# WaitlistNotice

A `sand` notice at the top of Overzicht when a spot opens up for a lesson the member is waiting for.

**Consumer provides:** the lesson (title, date, time, coach) of a `lesson-enrollment` with status `waitlisted` and `waitlistNotifiedAt` set, and the confirm / decline actions.

- `.app-notice`: eyebrow "Wachtlijst", "Er is een plek vrij bij {les}." (Poppins 600), one line with the date, time and coach and what happens if they don't respond, then "Bevestig plek" (`sl-btn-ink`) and "Laat plek gaan" (`sl-btn-ghost-light`).
- Shown above everything else, once per offered spot; it disappears after confirming or declining. If several spots are offered at once, show the soonest and the others in their rows.
- `sand`, not orange: it's important but it isn't the screen's main action. Also send a push notification (app) and an email with the same words.
