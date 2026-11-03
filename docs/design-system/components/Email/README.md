# Email

Transactional emails for Sportlab (proefles, account, lidmaatschap, webshop): a light, readable letter with an ink header, built so Resend and every mail client keep the styling. Every email uses the same header, card and footer; only the content blocks differ.

**Sender:** every email comes from **Team Sportlab** (`Team Sportlab <hallo@sportlab.nl>`), and replies go to the same inbox.

**Consumer provides:** the copy and data per email (Dutch, *je/jouw*), a subject line, an inbox preview line (≈ 90 characters), absolute https URLs for the links, and the footer reason ("Je ontvangt deze e-mail omdat …").

## Anatomy (600px)

- **Ground:** `surface-page`, 32px around the card (0 on phones).
- **Header:** `ink` band, `radius-card` on top. `SPORTLAB` wordmark in `white` (Archivo 800, 15px, +0.25em) left, `GRONINGEN` eyebrow in `text-on-panel-eyebrow` right. Typeset, never an image.
- **Body:** `warm-white` card, 40px padding (24px on phones), `radius-card` at the bottom. In order: eyebrow (`eyebrow`, `text-eyebrow`), heading (Poppins 700 28/34, `text-strong`, sentence case, ends in a full stop), body (Poppins 400 15/24, `text-body`), then the blocks below.
- **Footer:** on `surface-page`. Small `ink` wordmark with the social links on the right (`INSTAGRAM · FACEBOOK`: Archivo 700 11px spaced caps in `ink`, stacked under the wordmark on phones; typographic, no icons), then "Vragen? Beantwoord deze e-mail gewoon", address and site link (`ink`, underlined), and the reason line, all Poppins 12/18 in `text-muted`. Transactional, so no unsubscribe link.

## Blocks

| Block | Use |
|---|---|
| **CTA button** | THE action, one per email. `cta` fill, `on-cta` (ink) label, Poppins 600 15px, 48px tall, `radius-pill`. Outlook desktop gets a VML roundrect in the same colours (square corners there are fine). |
| **Detail list** | Facts to act on: date, time, coach, plan, price. `sand` box, `radius-card`; labels in Archivo 700 11px spaced caps (`text-muted`, 4.97:1 on sand), values in Poppins 600 15px `ink`, rows split by `line`. |
| **Steps** | Up to 3 short lines: what to bring, how to start. Number in Anton 20px `ink` ("01"), text in Poppins. |
| **Order table** | Webshop lines: name (600) + variant (13px muted), quantity, price right-aligned; a 2px `ink` rule above the totals. |
| **Fallback link** | Auth emails only: "Werkt de knop niet?" with the raw URL, 12px. |
| **Text link** | `ink`, underlined, weight 600. Never orange. |
| **Sign-off** | "Tot snel," + name in 600 and role in `text-muted`. Defaults to **Team Sportlab**; the proefles and welcome emails sign with the coach. |

## The templates

| Template | Eyebrow · heading | CTA |
|---|---|---|
| ProeflesBevestigd | GRATIS PROEFLES · Je proefles staat gepland. | Zet in je agenda |
| EmailBevestigen (Payload verify) | ACCOUNT · Bevestig je e-mailadres. | Bevestig je e-mailadres |
| WachtwoordReset, `soort="vergeten"` (Payload forgot password) | ACCOUNT · Kies een nieuw wachtwoord. Link 1 uur geldig. | Kies een nieuw wachtwoord |
| WachtwoordReset, `soort="nieuw"` (new account, first password) | ACCOUNT · Kies je wachtwoord. Subject "Je Sportlab-account staat klaar", link 7 dagen geldig. | Kies je wachtwoord |
| Welkom | LIDMAATSCHAP · Welkom bij Sportlab, {naam}. | Plan je eerste training |
| BestellingBevestigd (webshop) | BESTELLING {nr} · Bedankt voor je bestelling. | Bekijk je bestelling |

## Rules

- **Orange:** only the CTA button. Headings, links and numbers stay `ink`.
- **One look:** no photo headers, kapstok, haakjes or stickers in any email, the welcome email included. Variation comes from the content blocks only.
- **Copy:** Dutch, sentence case, short. Lead with what happened ("Je proefles staat gepland."), then what to do. No emoji.
- **Contrast:** every pair is AA: `text-body` on `warm-white` 10.7:1, `text-muted` on `warm-white` 5.85:1, on `sand` 4.97:1, on `surface-page` 4.63:1, `ink` on `cta` 6.96:1.

## Why it survives Resend and mail clients

- Layout is nested `<table role="presentation">` (no flex, grid or CSS variables); every style is inline, with hex values from this system's tokens. The `<style>` block only adds the phone breakpoint and client fixes, so Gmail stripping it costs nothing but the phone padding.
- Fonts: Anton, Poppins and Archivo load from Google Fonts where the client allows (Apple Mail, iOS Mail). Gmail and Outlook use the fallbacks: Impact / Arial Narrow for Anton, Helvetica / Arial for Poppins and Archivo.
- Colour scheme is declared light (`color-scheme: light`), so Apple Mail keeps the brand colours; clients that force dark mode invert a palette that stays legible.
- No images: the wordmark is live text and nothing depends on a background image, so emails look the same with images blocked.
- Every email ships an HTML and a plain-text part, and stays far below Gmail's 102 KB clipping limit (8–14 KB).
- Resend sends the HTML untouched. Click tracking rewrites the link URLs only.

The React code (`src/emails/` in the website repo) is in the Sportlab project doc *Transactional emails (Resend)*. Email clients can't read `tokens.css`, so `src/emails/tokens.ts` holds the same hex values; update it when a colour token here changes.
