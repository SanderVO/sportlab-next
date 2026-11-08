# CoachMembers

The Leden tab: every member, searchable, with today's participants first.

**Consumer provides:** members (`users` with role `user`), today's lessons the coach coaches with their participants, and one status line per member.

- Coaches see **all** members. Search by name or email (native search field, `.app-search`).
- Filter chips (`.app-chips`, horizontal scroll, `aria-pressed`): *Vandaag in de les* (default; grouped per lesson the coach coaches today) · *Mijn PT-klanten* (members with a PT lesson with this coach in the last 8 weeks) · *Aandacht* (the signals from CoachHome) · *Alle leden* (A–Z).
- Each row (`.app-rowlink`): avatar, name, optional tag (*Nieuw*), one status line: credits, program week, or "laatste meting 4 weken geleden". Tapping opens CoachMember.
- Lists use FlashList; avatars are 128px thumbs.
