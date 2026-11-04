# EventCard

An event that isn't tied to a program (running, Hyrox, specials), on Overzicht and in Events.

**Consumer provides:** an `events` doc (`title`, `eventType`, `bannerImage`, `startsAt`, `location`, `capacity`, `signupOpenAt`, `signupCloseAt`) and this member's `event-registration` if any.

- `.app-card.flush` > `.app-media` (200px; 140px on phones): `bannerImage` with `.sl-photo-overlay`, or the dark glow when there's none; the type tag top-left (`running` Hardlopen · `hyrox` Hyrox · `special` Special); the day in Anton with month and weekday/time.
- `.app-media-body`: title, place with `map-pin`, then the state: `registered` → "Ingeschreven" tag + "Details →"; `waitlist` → "Wachtlijst" outline tag; open for sign-up → free spots, the sign-up deadline and "Inschrijven" (ghost); closed → "Inschrijving gesloten" in `text-muted`.
- **Order:** events the member is registered or waitlisted for, then events open for sign-up, each by date.
- **Web:** cards side by side (`.app-hscroll` wraps). **App:** one horizontal row of 286px cards with snapping (a horizontal FlashList), the next card peeking in.
