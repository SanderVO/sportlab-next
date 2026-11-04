# MemberNav

The member area's navigation: five items, the same on web and in the app.

**Consumer provides:** the current section and the links.

- **Items, in this order:** Overzicht (`house`) · Lessen (`calendar-days`) · Events (`flag`) · Voortgang (`trending-up`) · Ik (`user-round`). Lucide icons, stroke 1.75.
- **Web:** `.app-header` > `.app-header-in` (max `app-container` 1200px): the `SPORTLAB` wordmark (`.app-wm`), `.app-nav` (44px items, icon + label; the current one has `aria-current="page"`, `ink` text and a 2px `ink` underline), then one button: "Les boeken" as `sl-btn-cta`, or `sl-btn-ink` on a screen whose orange action is somewhere else (the new-member Overzicht).
- **App:** use the **native tab bar** (iOS tab bar / Android bottom navigation, e.g. Expo Router's native tabs or react-native-bottom-tabs). We set only the icons, the labels and the tint: `ink` active, `text-muted` inactive. The `.app-tabbar` here is a mock for previews; don't rebuild it in JS. On iOS you may use SF Symbols instead of Lucide (see Iconography).
- **Website below 768px:** the header keeps only the wordmark; the five items move to a fixed bottom bar (`.app-tabbar.web.app-phone-only`), so web and app match.
- No avatar, hamburger or extra menu: Ik holds account, subscription, language and settings.
