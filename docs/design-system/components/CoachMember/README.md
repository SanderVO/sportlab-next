# CoachMember

A member's page for coaches: quick actions, the shared coach notes, credits, upcoming lessons, progress and the logbook.

**Consumer provides:** the member (`firstName`, `lastName`, `avatar`, member since, subscription), their coach notes, credits per type and period, upcoming enrollments, the latest measurements and completed lessons with tracking.

- Head: large avatar, full name, "Lid sinds maart 2025 · Groep + PT".
- **Quick actions** (`.app-qa-grid`): *Meting* (new `health-measurements` entry), *Credits* (a `credit-adjustments` entry with reason; `addedBy` = the coach), *Inschrijven* (book the member into a lesson; `addedBy` = the coach).
- **Coachnotities** (CoachNotes) come right after the quick actions.
- **Credits:** remaining per type and period ("3 van 8 over · november", "0 van 1 over · week 45").
- **Logboek:** completed lessons with attendance and "x van y gelogd". The member's own exercise notes (`lesson-exercise-tracking.exercises.notes`) show as `.app-ownnote` "Notitie van Lisa", so coaches can tell them apart from coach notes.
- Also on the page: upcoming lessons and the three main measurements (ProgressStats, compact).
