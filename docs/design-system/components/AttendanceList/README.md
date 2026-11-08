# AttendanceList

The participant list of a lesson with a one-tap attendance toggle per person, made for one hand on the gym floor.

**Consumer provides:** per enrollment the member's avatar or initials, name, credit type ("Groepscredit", "PT-credit") or "Traint mee · geen credits nodig" for a coach, an optional label, and `attendance`.

- `li.app-person`: the avatar and name link to the member (CoachMember); the 48px `.app-att` button on the right toggles **leeg → aanwezig → niet gekomen → leeg**. Unmarked is a dashed circle, present an `ink` circle with `check`, no-show an outline circle with `x`. Each button has an `aria-label` with the name and state.
- No confirm dialogs and no save button: every tap saves (`lesson-enrollments.attendance` + `attendanceMarkedBy`). Offline, taps queue locally and sync later.
- "Rest aanwezig" (ghost) marks everyone still unmarked as present. "Lid toevoegen" adds a walk-in (creates an enrollment with `addedBy`).
- Labels (`.app-tag.line.s`): **Coach** (a coach training along: no credits needed), **Eerste les**, **Nieuw**.
- Before the window (more than 15 min before the start) the toggles are disabled (`opacity .45`) with the line "Kan vanaf 08:45, een kwartier voor de start."
- Rows are at least 64px tall.
