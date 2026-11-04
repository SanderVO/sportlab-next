# MemberHome

Overzicht on the web for a member with lessons, a program and measurements: the home page of the member area.

**Consumer provides:** everything the parts need (see each component), the member's `firstName` and today's date.

- Order, top to bottom: MemberNav · greeting ("Goedemiddag, Lisa.": goedemorgen / goedemiddag / goedenavond, with the date as eyebrow) · WaitlistNotice (only when a spot is offered) · NextLesson + ProgramCard side by side · LessonRow list "Lessen deze week" (next 7 days, open lessons) · EventCard row · ProgressStats + logbook.
- One orange action: "Les boeken" in the header. Below 768px this page becomes MemberHomeApp's layout automatically.
- No campaign line, no stickers: this is a tool.
- Sections without data disappear rather than showing empty cards, except Voortgang, which shows its empty state.
