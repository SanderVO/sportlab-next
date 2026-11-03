# MemberHomeApp

Overzicht in the React Native app (and on the website below 768px): the same blocks as MemberHome, stacked in the same order.

**Consumer provides:** the same data as MemberHome and MemberHomeNew.

- **Frame:** a top bar with the `SPORTLAB` wordmark only, content with `app-gutter` (24px) sides and 28px between sections, then the native tab bar (MemberNav).
- **Steps down for phones:** `app-h1` 28/34, `app-h2` 20/26, `app-time` 72px, stats 28px; workout blocks become a list; lesson rows put time and spots under the title; events become a horizontal row; the WaitlistNotice buttons share the width.
- **Orange:** "Les boeken" as a full-width button at the end of the week's lessons (member), or "Plan je eerste les" in the hero (new member).
- **Performance:** one vertical scroll (a FlashList or ScrollView with fixed sections), the horizontal event list as a FlashList, images sized to their frame and cached, no shadows, blur or animated gradients; pull to refresh refetches Overzicht only.
- **Language:** all words from the shared `nl` / `en` message files; dates and numbers via `Intl`.
