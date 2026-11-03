# BlogMobile

The blog overview and an article at phone width (390px): the same components, stacked, with the type stepped down.

**Consumer provides:** the same data as BlogIndex and BlogPost.

- **Frame:** add `.web-m` to `.web` (in the app, use a <768px breakpoint). The side padding is `web-gutter` (24px).
- **Type steps:** `web-display` 56px, `web-h1` 34/40, `web-h2` 26/32, `web-lead` 18/30, `web-pull` 30px. `web-body` stays at 18/31; don't go smaller for long reads.
- **Header:** wordmark plus a "Menu" ghost pill. The header has no orange button on mobile; instead, the article has a sticky bottom bar on `surface-card` with the orange "Plan je proefles" button.
- **Overview:** hero panel, filter chips in a horizontal scroll row, then cards stacked full width, with the featured post first.
- **Article:** the table of contents is hidden. Content order: breadcrumb, title, lead, author row, cover, then the body.
- **Touch targets:** at least 40px (chips, buttons).
