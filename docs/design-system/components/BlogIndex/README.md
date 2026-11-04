# BlogIndex

The /blog overview page (concept): a campaign hero, category filters, one featured article, a grid of article cards and an instap banner.

**Consumer provides:** a list of posts from Payload, each with title, slug, category, publish date, excerpt, reading time, a cover photo and an optional haakje. Also the category list, the total count and the "featured" flag.

- **Page:** `.web` on `surface-page`. Content sits in `.web-wrap` (max `web-container` 1200px). Sections are `space-60` apart, and `space-80` before the footer.
- **Header:**
  - `SPORTLAB` wordmark on the left.
  - Navigation in Poppins 600 15px. The current page gets a 2px `ink` underline and `aria-current`.
  - One orange `.sl-btn-cta` "Plan je gratis proefles" on the right. It's the only orange in the header.
  - The nav items are placeholders: use the site's real menu.
- **Hero:** a wide gym photo (`group-class-in-action.jpg`) as an `.sl-photo`, under an ink gradient that runs from left to right (95% → 20%) plus a darker bottom. On top, on the left: the English campaign line in `web-display` (Anton, uppercase; the haakje follows the season, e.g. "TO KEEP GOING") and a short Dutch intro in `web-lead`, in `text-on-panel-muted`. Keep the text on the dark side, and choose photos whose action sits on the right.
- **Filters:** `.web-chip` pills with `aria-pressed`. The selected chip is filled `ink`; never orange.
- **Featured:** `.web-featured` on `surface-card`, with the photo on the left (optionally with a `.sl-sticker-ticket` haakje) and the text on the right.
  - Text order: `web-meta` (Uitgelicht · category · date), the title in `web-h2` at 40px, the excerpt in `web-body`, then a `.sl-btn-ink` "Lees het verhaal →" and the reading time.
- **Cards:** `.web-card` in a 3-column `.web-grid`.
  - Photo 16:10, with an optional `.sl-sticker-label` haakje.
  - Under it: `web-meta` (category · date), the title in `web-h3`, a 2-line excerpt in `web-small`, and the reading time in `web-meta`.
  - The whole card is the link. Focus is the 2px `focus-ring` outline.
- **Instap banner:** after the first row of 3 cards, a `.sl-dark` panel with "ONE MORE REASON TO START", the promise text and the orange CTA.
- **Load more:** `.sl-btn-ghost-light` "Meer artikelen laden".
- **Footer:** an `ink` band with the wordmark.
- **Links on light grounds** are `ink` with a 2px underline (`.web-link`), never orange text: orange is only 2.6:1 on light.
- **Photos:** put an `<img>` inside `.web-photo`. It fills the frame (`object-fit: cover`); set `object-position` per crop. The preview uses the four photos from Assets → Photography, reused with different crops. Without an image, `.web-photo` shows the dark placeholder. Every image needs Dutch alt text describing the scene.
- **Mobile:** see BlogMobile. The articles in this preview are sample content.
