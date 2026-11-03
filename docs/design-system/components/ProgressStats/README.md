# ProgressStats

The Voortgang summary: the latest measurements with their change, a weight line, the logbook, and an empty state.

**Consumer provides:** the member's `health-measurements` (latest two for the change, the last ~6 for the line: `measuredAt`, `weight`, `bodyFatPercentage`, `muscleMass`) and completed `lesson-enrollments` with their `lesson-exercise-tracking` (exercises completed / total).

- **Stats** (`dl.app-stats`): three `warm-white` tiles: label (Archivo caps), value in Anton with the unit in Poppins, change since the previous measurement ("−1,2 kg sinds 8 sep"). The change is plain text: no red/green and no arrows that judge, because whether down is good depends on the goal.
- **Line** (`.app-spark`): one `ink` polyline over a `line` baseline, dates under it, and an `aria-label` that says the trend in words. Plain SVG, no chart library.
- **Logbook** (`li.app-log`): date, lesson, "Afgerond · 6 van 8 oefeningen gelogd"; "Aanvullen" (ghost) when exercises are missing.
- **Empty** (`.app-stat.empty`): dashed `control-border` tiles with "—", "Nog leeg, en dat is prima." and a line about what will appear after the first measurement.
- Other measurement fields (BMI, visceral fat, metabolic age…) live on the Voortgang page, not on Overzicht.
