# MemberLessonsApp

Lessen in the React Native app (and on the website below 768px): Credits on top, then a segmented control between Rooster and Mijn lessen.

**Consumer provides:** the same data as MemberLessons.

- **Frame:** top bar with the wordmark, eyebrow + "Lessen", Credits (two types side by side), the segmented control, the chosen view, then the native tab bar (Lessen current).
- **Segmented control:** native (`@react-native-segmented-control/segmented-control` on iOS, Material segmented buttons on Android); `.app-seg` is only the preview and web mock. Options: "Rooster" (default) and "Mijn lessen".
- **Rooster:** WeekStrip (swipe for another week) and the day's LessonCards in one column.
- **Mijn lessen:** Ingeschreven (per week) and Gevolgde lessen (per month), both with LessonThumbs, and "Toon oudere lessen".
- **Performance (60fps):** one FlashList per view with the header (Credits + control) as `ListHeaderComponent`; cards have a fixed height per state; images via `expo-image` at card / thumb size with caching; the fallback, glow and overlay are static images; no shadows or blur. Pull to refresh refetches the visible week and the credits.
- **Language:** all words from the shared `nl` / `en` files; dates via `Intl` ("dinsdag 3 november" / "Tuesday 3 November").
