# Story

Instagram Story template (9:16) in three treatments: hero/instap, manifesto opener, campagnezin.

**Consumer provides:** a gym photo or a dark placeholder, the haakje, one supporting sentence, and the CTA label.

- Structure: `.sl-social.sl-story` + a ground class. `SPORTLAB` wordmark (15px) top-left; content bottom-aligned; one orange CTA pill at most.
- **Hero · instap** (`.sl-dark`): Tag "ONE MORE REASON" → Anton kapstok + haakje → Poppins sentence → CTA.
- **Manifesto · opener** (`.sl-dark-steel`): Poppins 700 warm heading + three short "Tot…" lines, "SWIPE VERDER →" in Anton. No CTA.
- **Campagnezin** (`ink`): the campaign line, second half in `sand`, footer "ONE MORE REASON · 2026".
- **With photography (as in the hero preview, using `coaching-dumbbell-row.jpg`):** put `<img class="sl-photo">` full-bleed as the first child, then `<div class="sl-photo-overlay strong">`. The strong overlay darkens the top for the wordmark and everything below the middle for the text. Pick photos from Assets → Photography and set `object-position` so faces stay clear of the text. Text is always white; only the CTA pill is orange.
