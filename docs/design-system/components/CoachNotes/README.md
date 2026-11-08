# CoachNotes

Notes about a member for the whole coaching team: every coach and admin can read and add them, the member never sees them.

**Consumer provides:** the member's `coach-notes` (author name and avatar, date, body), newest first, and the save action.

- `.app-notes` on `warm-white` with a `line` border, so it reads as a separate, internal block. Title "Coachnotities" with a `lock` icon, and always the line "Alle coaches en admins zien deze notities. {Voornaam} niet."
- Each note (`.app-note`): small avatar, author, date, then the text. A note you wrote shows "{Naam} (jij)". A note without an author shows "Oud coach" as the name.
- "+ Notitie" opens the composer inline: a labelled `app-textarea`, "Annuleren" (ghost) and "Opslaan" (`sl-btn-ink`). No orange.
- **Access** (`coach-notes`): create and read for coaches and admins; update and delete only by the author or an admin; members have no access to notes about themselves, also not through the API. A note stays when its author's account is deleted: `author` is then empty and only an admin can edit or delete it.
- Keep notes about training: goals, technique, agreements, preferences. Medical details belong in the member's own intake, not here.
