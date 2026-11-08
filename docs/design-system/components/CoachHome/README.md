# CoachHome

Overzicht for a coach in the app: what they coach today, their own training and what needs their attention.

**Consumer provides:** the coach's lessons today (`lessons` where `coaches` contains the user), their own `lesson-enrollments`, and the computed signals.

- **Who:** users whose `roles` contains `coach` (or `isCoach`). Same app and login as members; the tab set changes to Overzicht · Lessen · Leden · Events · Ik (see CoachNav rules in the README).
- Order: top bar with the wordmark and a `Coach` outline tag · greeting with "Je coacht vandaag 3 lessen." · the dark panel for the lesson that's on now (or the next one) · Vandaag (all of today's lessons they coach, `.app-rowlink`) · Jij traint mee (their own booking) · Aandacht (signals).
- **The panel:** fase ("Nu bezig · jij coacht" / "Straks · jij coacht"), time left, start time in `app-time`, title and co-coaches, `.app-counts.panel` (Ingeschreven · Aanwezig · Wachtlijst), "Aanwezigheid" (`sl-btn-sand`) and "Op tv" (ghost on dark). **No start button:** a lesson starts by itself at `startDate`.
- **Signals** (computed, max 5, newest first): 0 PT credits this week for a client · 3+ weeks without a lesson · late cancellation (`cancelledAt` less than 5 min before the start) · an offered waitlist spot that wasn't confirmed. Each row links to the member or the lesson.
- **No orange** on coach screens: nothing here is a sell.
