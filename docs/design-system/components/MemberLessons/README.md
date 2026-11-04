# MemberLessons

Lessen on the web: the timetable to book from, the member's credits, what they're enrolled in, and the lessons they followed.

**Consumer provides:** everything the parts need: WeekStrip (the week's lessons), LessonCard, Credits, LessonThumb (enrollments and history).

- Order: MemberNav (Lessen current) · eyebrow "Week 45 · 2 – 8 november" + `app-h1` "Lessen" · `.app-row`: the Rooster card (`.wide`: WeekStrip + the chosen day's LessonCards) next to a side column (`.side`: Credits, then Ingeschreven) · Gevolgde lessen full width.
- **Orange:** none on this page. The header button "Les boeken" is `sl-btn-ink` and jumps to `#rooster`; booking happens with the ghost buttons in the cards.
- Below 768px this page uses MemberLessonsApp's layout.
- Links: "Bekijk je credits en abonnement →" goes to Ik › Abonnement, "Naar je logboek →" to Voortgang.
