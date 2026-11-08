One More Reason is the campaign platform of **Sportlab Groningen**: one idea that keeps paying out. *One More Reason* is the **kapstok** (the fixed platform), and every piece hangs one **haakje** (hook) underneath it: a reason that fits the moment and the audience.

> YOU DO NOT NEED A PERFECT REASON.
> JUST ONE MORE REASON TO START.

## The idea: kapstok + haakje

- The kapstok is always `ONE MORE REASON`. The haakje completes it: `TO START` · `TO KEEP GOING` · `TO GET STRONG` · `TO STAY FIT` · `TO STAY HEALTHY` · `TO KEEP IN SHAPE`.
- **TO START is the strongest haakje (instap):** for people who have wanted to begin for a long time but keep postponing. Use it in January, September and at every other intake moment.
- The promise: *"Geef jezelf een jaar waarin je sterker wordt dan je dacht. Begin met een proefles, kies je eerste 12 weken, en bouw vanaf daar verder."* (see Belofte).
- The `SPORTLAB` wordmark is always present. One More Reason is the campaign layer on top of it, never a replacement.

## Dosage: use the campaign sparingly

One More Reason works because it is rare. Used everywhere, it turns into wallpaper and nobody reads it any more.

- **The kapstok once per page.** `ONE MORE REASON …` appears in one place only: the hero *or* one campaign moment, never both. Everything else on the page speaks plain Dutch in Poppins.
- **At most one haakje sticker per page** on the website (`.sl-sticker-label`, `.sl-sticker-ticket`). A grid of cards gets none, or one on the featured card.
- **Never as decoration.** No marquees, repeated bands, background patterns or kapstok lockups in the footer.
- **Name things plainly.** Section and product titles are not haakjes: "Personal training", "Performance Cycle", "Veelgestelde vragen". A short English title in Anton is fine, without "one more" attached.
- **Heroes and end CTAs carry one message.** A headline, at most one supporting sentence and at most two buttons. No tags, kicker lines, lists of haakjes, stats or promise boxes stacked on top.
- **Campaign pieces may lean in.** A story, poster or intake landing page *is* the campaign moment, and the kapstok can lead there, but still once per piece.
- The test: remove the line. If the page loses nothing, leave it out.

## Voice and copy

- **Two languages, two jobs.** The kapstok, haakjes and the campaign line are **English, UPPERCASE, in Anton**. Everything that explains, invites or sells is **Dutch, sentence case, in Poppins**, addressed with *je/jouw*.
- Tone: honest, low-pressure, encouraging. No perfection and no hard sell: *"Je hebt geen perfecte reden nodig. Eén reden is genoeg om te beginnen."*
- Manifesto rhythm: short lines that build from doubt to one concrete step: *"Misschien wacht je op het perfecte moment. / Tot je fitter bent. / Tot het rustiger wordt. / Tot je zeker weet dat je het volhoudt."* → *"Sterker worden begint niet met perfect zijn. Het begint met opkomen dagen."*
- CTAs are short Dutch imperatives: "Plan je gratis proefles", "Start je eerste 12 weken", "Word lid", "Doe mee →", "Lees het verhaal", "Meer info". English is allowed for a casual link: "Let's talk goals →".
- Offers as eyebrows: "GRATIS PROEFLES", "12 WEKEN", "12-WEKEN CHALLENGE · START SEPTEMBER".
- Separate lists of haakjes or labels with a middle dot ` · `. Use "→" on forward actions. No emoji.

## Colour

Monochrome: a near-black gym world, warm white and sand. **Orange is the one action colour.**

| Token | Hex | Role |
|---|---|---|
| `ink` | #14110D | Dark panels, social backgrounds, ink type on light |
| `charcoal` | #241E17 | Raised dark surfaces, top of the dark gradient |
| `sand` | #E8E0CE | Promise box, light stickers, secondary button on dark, highlight line on dark |
| `warm-white` | #F6F2EA | Lightest brand surface, stickers |
| `cta` | #E8842B | **CTA only** |
| `steel` · `olive` | #46555F · #5E5F47 | Quiet sub-campaign accents |

- **The orange rule:** `cta` only ever appears on buttons and text links ("Plan je proefles", "Doe mee", "Begin vandaag"). Never use it as a fill, block, background, heading, haakje, sticker or decoration. Headings, haakjes and the kapstok stay `white` on dark or `ink` on light, so the action is always the only thing that lights up.
- `steel` and `olive` are for quiet sub-campaign accents only, never for actions.
- Page grounds: `surface-page` (#DCD9D1 warm grey) with `surface-card` (#EFECE4) panels; campaign pieces sit on `surface-panel` / `ink`.
- Text: `text-strong` for headings, `text-body` for copy, `text-muted` for intros and captions, `text-eyebrow` for spaced-caps labels; on dark use `text-on-panel`, `text-on-panel-muted` and `text-on-panel-eyebrow`.
- **Accessibility (WCAG 2 AA):** every text/ground pair in this system passes 4.5:1 (3:1 for 24px+ display type). To get there, the toolkit's text greys were adjusted while the brand hues stayed exactly the same: `on-cta` is **ink** on orange (6.96:1), never white; `text-muted` and `text-eyebrow` are #625D54 on light grounds (≥4.63:1); `text-on-panel-eyebrow` is #A59B8E on dark panels (≥4.63:1 even on the brightest glow). Use these tokens, never the toolkit's original greys or hard-coded hex. Orange is never used as text on light grounds (2.6:1).
- Focus: a 2px solid `focus-ring` outline with a 2px offset (an addition; the toolkit shows no focus state).

## Typography

Three roles, all Google Fonts:

- **Display: Anton** (`--font-display`). Gritty caps for power: the kapstok, haakjes, campaign line and statements. Always UPPERCASE, tracking 0, tight leading (`display-xl` 116/.86, `display-l` 58/.86, `display-m` 30/1, `display-s` 28/.93, `quote` 20/1.2, `chip` 15).
- **Warm: Poppins** (`--font-sans`). Rounded and human: warm headings in 700 (`heading-warm` 34/36, e.g. "Samen werken aan jouw doelen."), body in 400 (`lead` 17/26, `body` 14/22, `small` 12.5/18, `caption` 12/18), buttons in 600 (`button` 14), the promise in 600 (`promise` 15/20).
- **Label: Archivo** (`--font-label`). The tight wordmark font: `wordmark` (800, +0.25em), `section-title` (800, 26px, −0.01em), spaced-caps `eyebrow` / `eyebrow-s` (700, +0.2em) and `haakjes-line` (700, +0.14em).
- Never mix the roles: no Anton for Dutch body copy, and no Poppins for the kapstok.

## Layout, shape and surfaces

- Spacing is measured, not a strict grid: `space-8` chip gaps, `space-16` tile gaps, `space-22` small tile padding and button side padding, `space-24` card padding and social safe area, `space-28` column gap, `space-32` large panel padding, `space-60` page inset, `space-80` between sections.
- Radii: `radius-card` 8px on cards, tiles and social templates; `radius-chip` 6px; `radius-sticker` 5px; `radius-badge` 18px (rep counter); `radius-pill` for every button and tag.
- **Dark campaign surfaces are never flat.** Use `.sl-dark`, a warm radial glow (`panel-glow`) top-right falling through `charcoal` to `panel-deep`, for the gym-light feel. The manifesto uses the cool `.sl-dark-steel` variant (`steel-glow` → `steel-deep`). Both mimic gym photography until a real photo is dropped in.
- No drop shadows in UI, except the woven patch, which gets a soft physical shadow.

## Photography

- Use Sportlab's own gym photos from **Assets → Photography**: `group-class-in-action.jpg` (wide group shot, for heroes), `high-five-after-class.jpg` (community), `team-on-the-rowerg.jpg` (team / about us) and `coaching-dumbbell-row.jpg` (personal training, instap). The group's README says what each photo is good for.
- The mood: a dark hall, warm OSB wood, cool strip lights and real people mid-effort. Never use stock photos, and never tint the photos orange.
- In code, a photo is an `<img class="sl-photo">` that fills its frame (`object-fit: cover`, with `object-position` per crop). Inside a `.web-photo` card frame, a plain `<img>` does the same.
- Add `.sl-photo-overlay` (transparent → ink at the bottom) so the white type and the orange CTA always stay legible. For busy or bright photos, such as stories and posts, use `.sl-photo-overlay.strong`, which also darkens the top for the wordmark.
- Text over photos is always `white`; only the CTA pill is orange.

## Iconography

- Campaign pieces, the website pages, TV and email use **no icon set**. Graphic marks are typographic: "→" for forward actions, "·" as separator, "+1" (the rep counter) as the one-more symbol, and the opening quote mark in Anton.
- **The member area (web + app) uses Lucide**, a monochrome line set (`lucide-react` on web, `lucide-react-native` in the app; ISC licence). Only where icons help people scan: the navigation, times (`clock`), places (`map-pin`), status (`check`, `x` for cancelled), week arrows (`chevron-left` / `chevron-right`), manual credits (`circle-plus`) and the password toggle (`eye`). Stroke 1.75 at 18–24px, 2 at 14–16px. Icons are `ink` when active and `text-muted` otherwise, never orange, and always sit next to a text label (or carry an `aria-label` when they stand alone, like the password toggle).
- Navigation icons: Overzicht `house`, Lessen `calendar-days`, Events `flag`, Voortgang `trending-up`, Ik `user-round`. In the app's native tab bar, iOS can use the matching SF Symbols instead (`house`, `calendar`, `flag`, `chart.line.uptrend.xyaxis`, `person.crop.circle`); choose one per platform and keep it consistent.
- Still no emoji anywhere.

## TV dashboard (gym screens)

The `/tv` pages run on TVs on the gym wall: 1920×1080, read from 3–8 m, sometimes with a remote and mostly without.

- **Always dark, warmed with orange.** `.tv-screen.sl-dark` (or `.tv-glow` on any surface) layers three glows over a charcoal-to-ink fade: `tv-glow-ember` top-left, the warm `panel-glow` top-right and `tv-glow-ember-deep` bottom-right. There's no light theme on TV, because white grounds glare in a gym. Text uses `text-on-panel` (white), `text-on-panel-muted` and `text-on-panel-eyebrow`; every one of them stays AA on the brightest glow.
- **Orange tints only, per block.** The TV screens use the orange family for colour, with no steel or olive. Put `.acc-ember` (`orange-300` text, `orange-700` pill with white text), `.acc-peach` (`orange-200` text and pill with ink text) or `.acc-cta` (full `cta`, for the main block) on a card or modal. Its details then pick up that colour: a 6px top bar, the block number, the format line, a filled duration pill, the timer's progress bar, the 'next' station outline and the round counter. Alternate ember and peach per block, and give the main block (e.g. Strength) `cta`.
- **10-foot type** (the `TV — 10-foot` group): nothing smaller than 24px (`tv-label`, `tv-cue`). Body text is 34px (`tv-body`, `tv-exercise`), headings are Anton (`tv-heading` 64, `tv-block-title` 52, `tv-title` 120), and timers use `tv-timer` (300px, tabular numerals). If content doesn't fit, split it over pages or columns. Never shrink the type.
- **Safe area:** keep content inside `tv-safe-x` 96px / `tv-safe-y` 64px. Space between cards is `tv-gap` 40px, card corners are `radius-tv` 16px, and dividers are `line-tv`.
- **This is the one place orange goes beyond buttons.** On TV, orange tints colour the details, but solid `cta` is kept for the timer's start/pause button and the main block, so the action still reads first. The current station stays a `sand` fill, so 'now' never competes with orange. Outside the TV dashboard, the orange rule above still applies.
- **Remote:** everything focusable gets `.tv-focusable`, which shows a 6px `focus-ring` outline with a 6px offset. Buttons are 96px tall (`.tv-btn`, `.tv-btn-cta`, `.tv-btn-ghost`). Show a short key hint in a footer `tv-eyebrow`.
- **Screens:** TvPin (the 4-digit code in front of `/tv`), TvSchedule (`/tv?date=`), TvWorkout (`/tv/[id]`) and TvBlockTimer (the block modal with timer). Copy comes straight from Payload and stays as the trainer wrote it.
- **Locked until unlocked:** every `/tv` page sits behind TvPin. A correct code keeps that TV unlocked (a long-lived cookie), so staff type it once per screen. Errors on TV are an orange-tinted box with an "!" mark and a plain Dutch sentence, never colour alone; there is no red in this system.

## Website · blog

The concept pages for the blog (BlogIndex, BlogPost, BlogMobile) apply this system to the website: light grounds, reading sizes and the strict orange rule.

- **Grounds:** pages sit on `surface-page`; cards, the featured post and the mobile bottom bar on `surface-card`. Campaign moments (the hero, the instap banner and the end CTA) are `.sl-dark` panels.
- **Type:** the `Web — blog` group. Article and card titles are Dutch Poppins 700 (`web-h1` 56, `web-h2` 32, `web-h3` 22). Body text is `web-body` 18/31 at most `web-measure` (680px) wide. Labels are `web-meta` (Archivo, spaced caps). Anton is only for English campaign lines (`web-display`, `web-pull`).
- **Orange:** only the header button and one CTA per page. Links on light are `ink` and underlined (`.web-link`), and selected filters are `ink`.
- **Haakjes:** a sticker on a photo (`.sl-sticker-label`, `.sl-sticker-ticket`) can tie an article to the campaign. Use at most one per page (see Dosage).

## Website · evenementen

EventTimeline shows the upcoming `events` on a website page as a timeline: a large date, one continuous line, title and description, and square photos stepping between two lanes. Only upcoming events appear, it follows the page's Zwart, Beige or Wit ground, and it uses no orange.

## Email (transactional)

Service emails (proefles, account, lidmaatschap, webshop) are letters, not campaign pieces: light and quiet, so the one orange button is the only thing that lights up.

- **Shape:** `surface-page` ground, an `ink` header with the `SPORTLAB` wordmark, a `warm-white` card with an eyebrow, a Dutch Poppins heading and body, a `sand` detail box for the facts, one `cta` button, and a small footer in `text-muted`.
- **One look for every email:** the same header, card and footer in all of them. No photo headers, no kapstok, haakjes or stickers, not even in the welcome email.
- **Built for Resend:** tables, inline styles and hex values (no CSS variables), a VML button for Outlook, system-font fallbacks, an HTML and a plain-text part. See the Email component.

## Ledenomgeving (member area: web + app)

The logged-in environment for members: login, Overzicht (home), Lessen, Events, Voortgang and Ik. It runs on the website (Next + Payload) and in the React Native app, and **looks the same in both**: the same blocks, in the same order, with the same words. The web is only wider.

- **Grounds and type:** light, like the website: `surface-page` with `surface-card` cards. Dutch Poppins headings (`App — ledenomgeving` type group: `app-h1` 40, `app-h2` 22), Anton for numbers only (`app-time`, `app-number`: times, dates, measurements, program week), Archivo spaced caps for eyebrows and tags. The one dark surface is the "Volgende les" panel (`.sl-dark`), so the next lesson is the first thing you see.
- **Campaign:** none in the dashboard; it's a tool people use every week. The login is the only campaign moment (the kapstok once, "TO KEEP GOING.", on a photo).
- **Navigation, five items in this order:** Overzicht · Lessen · Events · Voortgang · Ik (Lucide icons, see Iconography).
  - *Lessen:* the timetable, booking, the waitlist, credits and the lessons you followed.
  - *Events:* programs (like the Performance Cycle) first, then events not tied to a program (running, Hyrox, specials).
  - *Voortgang:* measurements and the logbook.
  - *Ik:* account, subscription, language and settings.
  - Web: a header with the wordmark, the nav (active item `ink` with a 2px underline) and one button. App: the **native tab bar** (iOS tab bar / Android bottom navigation), not a custom one: we set only icons, labels and the tint (`ink` active, `text-muted` inactive). There is no avatar or menu button; Ik replaces it.
- **Phone layout:** the app, and the website below 768px, use the same phone layout (`.app-m` in previews; `bundle.css` applies it to `.app` automatically under 768px). On the web phone layout, the header nav is replaced by a fixed bottom bar with the same five items.
- **Orange:** one action per screen. On Overzicht that's "Les boeken" (web header; on phones a full-width button under the week's lessons). On the new-member Overzicht it's "Plan je eerste les", and the header button turns `ink`. Everything else is `sl-btn-ink`, `sl-btn-sand` (on the dark panel) or `sl-btn-ghost-light`. Links are `.web-link`.
- **Lesson states** (Payload `lesson-enrollments.status`): Inschrijven (room left, ghost button) · Op wachtlijst (full: ghost button, status `waitlisted`) · *Wachtlijst · 2e* (outline tag; place = order of `waitlistedAt`) · Bevestig plek (spot offered, `waitlistNotifiedAt` set: `ink` button, plus a `sand` notice at the top of Overzicht) · *Ingeschreven* (`ink` tag with `check`). Free spots = `spots` minus enrollments that aren't cancelled or waitlisted.
- **Lessen** (MemberLessons on web, MemberLessonsApp on phones): the WeekStrip calendar with the chosen day's LessonCards, the member's Credits, Ingeschreven and Gevolgde lessen (with LessonThumbs). No orange on this page: booking is the ghost "Inschrijven" in each card and the header button is `ink`. The app splits Rooster and Mijn lessen with a native segmented control.
- **Credits:** group lessons use groepscredits per calendar month, personal and semi-personal training use PT-credits per week (Monday–Sunday); open gym is free. A member can have one or both types, admins and coaches can add or remove credits by hand ("Inclusief 1 extra credit van Jesse"), and cancelling less than 5 minutes before the start doesn't refund the credit. The credit belongs to the period of the lesson, not of the booking. "Geen credits" and "Niet in abonnement" are disabled dashed buttons, and running out is a `sand` notice, never orange or red. Rules: see Credits. Fields: `subscription-plans`, `subscriptions`, `credit-adjustments` and `lesson-enrollments` (`cancelledAt`) in `data-schema.md`.
- **Lesson images:** every lesson shows an image: `lesson.image`, else the template's image, else `lesson-fallback.webp` (Assets › Fallbacks) with the `SPORTLAB` wordmark as text on top. The time sits on the image in Anton over `.sl-photo-overlay`; compact lists use a square thumb with the date. Always the Payload image size that fits (card 480×280, thumb 128×128).
- **Empty states are designed, not blank:** a new member (no enrollments, program or measurements) gets a different Overzicht: a photo panel with "Plan je eerste les", three steps, lessons with room, the next program, and dashed `—` tiles in Voortgang with a line saying what will appear. No lesson planned: the panel says "Nog geen les gepland." with "Bekijk lessen".
- **Controls:** inputs are 52px tall, 16px text, a 1px `control-border` on `warm-white`, `radius-card`. Touch targets are at least 44px. Labels sit above fields; no placeholder-only fields.
- **Copy:** Dutch, *je/jouw*, short: "Goedemiddag, Lisa." (from `users.firstName`), "Lessen deze week", "Nog geen les gepland.". Statuses are plain words, never codes.
- **Languages:** Dutch and English. Interface text lives in shared message files (`nl.json`, `en.json`) used by both web and app; content (lessons, programs, events) uses Payload localization with Dutch as the fallback. Dates and numbers come from `Intl` ("dinsdag 20 oktober" / "Tuesday 20 October", "68,4" / "68.4"). Campaign lines stay English in both.
- **Performance (app, 60fps):** flat surfaces only: no shadows, blur or animated gradients. Ship the dark panel's radial glow as one pre-rendered image (or a single static `react-native-svg` gradient). Lists use FlashList; the event row is a horizontal FlashList with snapping. The weight line is a plain SVG polyline. Photos are sized to their frame (no full-resolution images in lists).
- **Screens:** Login, MemberHome (web), MemberHomeNew (web, new member), MemberHomeApp (both, phone), MemberLessons (web), MemberLessonsApp (both, phone). **Parts:** MemberNav, NextLesson, LessonRow, WaitlistNotice, ProgramCard, EventCard, ProgressStats, Credits, WeekStrip, LessonCard, LessonThumb. Field names follow the Payload data schema (`data-schema.md`).

## Coachomgeving (coaches: app)

Coaches use the same app and login as members. When `users.roles` contains `coach` (or `isCoach` is on), the app shows the coach screens. They use their phone on the gym floor, so everything is built for one hand and a few seconds: big rows, one tap per action, no confirmation dialogs except for cancelling a lesson. Writing and editing lessons and workouts stays in Payload; the app is for what happens in and around a lesson.

- **Navigation, five items:** Overzicht · Lessen · Leden · Events · Ik (Lucide `house`, `calendar-days`, `users`, `flag`, `user-round`). Leden takes the place of Voortgang; a coach's own progress sits under Ik › Mijn voortgang. Same native tab bar and tint as members. A `Coach` outline tag in the top bar shows which mode you're in.
- **Overzicht** (CoachHome): the lesson that's on now or next in the dark panel, the rest of today, the coach's own training ("Jij traint mee") and Aandacht (signals that need an action).
- **Lessons start by themselves.** There is no "start les": the fase is computed from `startDate`/`endDate` (*Straks* · *Bezig* · *Afgelopen*). Attendance opens 15 minutes before the start and stays editable afterwards (AttendanceList).
- **Cancelling** is possible until the start, with a reason the participants read (CancelLessonSheet). It notifies everyone, refunds credits and clears the waitlist.
- **Coaches train along** by booking like any member. They have **unlimited credits**: no credit check and nothing counted, only a free spot is needed. In participant lists they get the label *Coach* and "Traint mee · geen credits nodig".
- **Leden** (CoachMembers, CoachMember): coaches see all members. A member's page has quick actions (Meting, Credits, Inschrijven), the coach notes, credits, upcoming lessons, progress and the logbook.
- **Coach notes** (CoachNotes) are shared: every coach and admin can read and add them, each note shows its author and date, and only the author or an admin can edit or delete one. A note stays when its author's account is deleted; it then has no author and only an admin can edit or delete it. The member never sees them. Members only see their own notes (the notes they write on exercises), which coaches see in the logbook as "Notitie van {naam}".
- **Orange:** none on coach screens. Actions are `sl-btn-ink`, `sl-btn-sand` (on the dark panel) or ghost; nothing here sells.
- **Performance:** the same rules as the member app (flat, FlashList, sized images). Attendance taps save optimistically and queue offline, because gym Wi-Fi is unreliable.
- **Screens:** CoachHome, CoachLesson, CoachMembers, CoachMember. **Parts:** AttendanceList, CancelLessonSheet, CoachNotes. Fields: `lessons` (cancel fields), `lesson-enrollments` (`attendance`), `coach-notes`, see `data-schema.md`.

## Components

Pure CSS in `components/bundle.css` (class prefixes `sl-`, `tv-`, `web-`, `app-`); load it after `tokens.css`. It imports Anton, Poppins and Archivo from Google Fonts.

- **Brand:** Wordmark (fixed `SPORTLAB` + co-branding), Lockup (A stacked poster · B woven patch · C inline/systeem).
- **Campaign:** HaakjeTile, HaakjeChip, Belofte, PullQuote.
- **Actions / labels:** Button (the only orange), Tag.
- **Stickers:** ticket, seal, label, rep counter, dot pill. Always monochrome.
- **TV dashboard:** TvPin, TvSchedule, TvWorkout, TvBlockTimer (see above).
- **Website · blog:** BlogIndex, BlogPost, BlogMobile (see above).
- **Website · evenementen:** EventTimeline (see above).
- **Email:** transactional emails for Resend (see above).
- **Ledenomgeving (web + app):** Login, MemberHome, MemberHomeNew, MemberHomeApp, MemberLessons, MemberLessonsApp; MemberNav, NextLesson, LessonRow, WaitlistNotice, ProgramCard, EventCard, ProgressStats, Credits, WeekStrip, LessonCard, LessonThumb (see above).
- **Coachomgeving (app):** CoachHome, CoachLesson, CoachMembers, CoachMember; AttendanceList, CancelLessonSheet, CoachNotes (see above).
- **Social templates:** Story 9:16, CarouselSlide 4:5, FeedPost 1:1 / 4:5. Every one has the wordmark top-left, white type, at most one orange CTA.

The original campaign toolkit (PDF) is under **Assets → Reference**.
