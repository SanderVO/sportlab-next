# CoachLesson

A lesson as a coach sees it: who's there, the waitlist, the workout and, before the start, cancelling.

**Consumer provides:** the `lesson` (title, type, `startDate`, `endDate`, `coaches`, `spots`, `workoutBlocks`), its `lesson-enrollments` with each member's credit type, labels (coach, first lesson, program) and attendance, and the waitlist in `waitlistedAt` order.

- **Fase** is computed, never set: *Straks* (before `startDate`) · *Bezig* (between start and end) · *Afgelopen*. Shown as a tag (`.app-tag.ink` for Bezig, outline otherwise) and one line ("Begint vanzelf om 09:00. Aanwezigheid kan vanaf 08:45.").
- **Counts** (`.app-counts`): Ingeschreven x / spots · Aanwezig · Open (not marked yet).
- **Attendance** (AttendanceList): from 15 minutes before the start, and editable afterwards.
- **Waitlist:** place, name, since when, "Plek aanbieden" (sets `waitlistNotifiedAt`, sends the offer).
- **Workout:** the blocks with timer mode and minutes, "Op tv" opens `/tv/[id]`. Editing workouts happens in Payload, not in the app.
- **Cancelling** (CancelLessonSheet): only while *Straks*. The outline button "Les annuleren" sits at the bottom, away from the attendance controls.
- Header: the native stack back button ("‹ Overzicht"), not a custom one.
