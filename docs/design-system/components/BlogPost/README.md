# BlogPost

The /blog/[slug] article page (concept): a readable long-form layout in the brand's warm voice, with one campaign moment and one CTA.

**Consumer provides:** title, category, date, reading time, author (name and initials or a photo), lead/intro, cover photo and caption, the rich-text body from Payload (H2, paragraphs, lists, links, bold, quote, a "tip" block and images) and 3 related posts.

- **Top:** a breadcrumb in `web-meta` with "Blog" as a `.web-link`. Then the title in `web-h1` (Poppins 700, sentence case, Dutch; never Anton), the lead in `web-lead` (max 880px wide) and an author row: `.web-avatar` (ink circle with initials, or a photo), the name in Poppins 600 and date · reading time in `web-meta`.
- **Cover:** a full-width `.web-photo` (16:9) with an `<img>` and a `web-small` caption. The preview uses `group-class-in-action.jpg`.
- **Body:** `.web-article` is 3 columns: a 220px table of contents, the text at `web-measure` (680px), then empty space.
  - Table of contents: `.web-toc`, sticky, linking to the H2s, with the current section in `ink`.
  - Text: `.web-prose` (`web-body` 18/31). H2s are `web-h2` with 48px above. List markers are `ink`. Links are `.web-link`.
- **Rich-text blocks:**
  - **Quote:** `.web-pull`, Anton 40px uppercase with a 6px `ink` rule. Use it only for an English campaign line. A Dutch quote is a bold paragraph.
  - **Tip:** `.web-tip`, a `sand` box with a "TIP VAN DE COACH" kicker and Poppins 600 text (the Belofte style).
  - **Image:** `.web-photo` with a caption, inside the text column.
- **End:** a `.sl-dark` CTA panel ("ONE MORE REASON TO START" + the orange "Plan je gratis proefles"), then "Lees verder" with 3 `.web-card`s and the footer.
- **One orange action per screen:** the header button and the end CTA. Everything else is `ink`.
- **Mobile:** see BlogMobile. The text in this preview is sample content.
