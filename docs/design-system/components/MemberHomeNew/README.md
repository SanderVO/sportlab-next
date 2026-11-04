# MemberHomeNew

Overzicht for a new member who has no lessons, program or measurements yet: it explains the first step instead of showing empty blocks.

**Consumer provides:** the member's `firstName`, lessons with room in the next 7 days, and the next program that starts.

- **When:** no `lesson-enrollments` (other than cancelled), no `program-enrollment` and no `health-measurements`. As soon as a lesson is booked, the member gets the normal MemberHome.
- Order: greeting "Welkom bij Sportlab, Lisa." · `.app-hero` with `coaching-dumbbell-row.jpg`, "Plan je eerste les." and the orange button · "Zo begin je" steps (`.app-steps`, numbers in Anton) · "Lessen met plek deze week" with a hint that semi-personal training is a good first lesson · the upcoming ProgramCard · ProgressStats empty.
- **Orange:** only "Plan je eerste les"; the header's "Les boeken" is `sl-btn-ink` here.
- The steps match the welcome email ("Zo begin je"), so the story is the same everywhere.
