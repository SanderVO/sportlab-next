# CancelLessonSheet

The confirmation for cancelling a lesson: a native bottom sheet with the consequences and a reason the participants will read.

**Consumer provides:** the lesson (title, date, time), the number of participants and waitlisted members, and the cancel action.

- Opens from "Les annuleren" on CoachLesson, only before the start. Use the platform's bottom sheet (iOS sheet / Android modal bottom sheet); `.app-sheet` is its mock.
- Content: "Les annuleren?", one sentence with the lesson and what happens ("8 deelnemers en 2 mensen op de wachtlijst krijgen een bericht. Hun credits gaan terug."), a required **Reden** field (`app-textarea`, shown to participants), then "Terug" (ghost) and "Annuleer les" (`sl-btn-ink`). No red, no orange.
- After confirming: `lessons.status` → `cancelled` with `cancelledAt`, `cancelledBy` and `cancelReason`; all enrollments → `cancelled` without losing credits; the waitlist is cleared; push + email to everyone with the reason. The lesson shows a `sand` notice "Deze les gaat niet door." and the fase tag reads *Geannuleerd*.
- Members see the cancelled lesson in Lessen with the reason, not just a missing lesson.
