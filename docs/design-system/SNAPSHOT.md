# Design system snapshot

A read-only copy of the **One More Reason** design system for Sportlab Groningen, so tools that cannot open the claude.ai artifact (OpenCode, other LLMs, reviewers) can still read it.

- **Authority:** the artifact, https://claude.ai/code/artifact/b85d45fc-1044-491b-ab0c-827f00966109. This folder is a copy; if they differ, the artifact wins.
- **Snapshot of:** `lastChange.at` `2026-11-08T20:01:00Z` (see `design-system.json`).
- **Do not edit by hand.** Refresh it from the artifact (see below).

## What is in here

| Path | What |
|---|---|
| `README.md` | The brand rules: kapstok + haakje, dosage, colour, type, voice, layout, iconography. Read this first. |
| `components/<Name>/README.md` | Per component: what data it takes, markup, states, rules. |
| `tokens.json`, `design-system.json` | The raw tokens and the version stamp. The Tailwind version of the tokens is `src/app/(frontend)/sportlab-theme.css`. |
| `assets/*/README.md` | What the photography and reference assets are for. |

## Not copied

- `components/bundle.css` and the `sl-*` / `tv-*` / `app-*` / `web-*` classes it defines. They are not in this repo: recreate components with Tailwind utilities and the tokens (see `AGENTS.md`).
- The `preview.html` of every component. They are markup-only (the artifact viewer injects the CSS), so they don't render outside the artifact, and they use `sl-*` / `app-*` classes that aren't in this repo. Left out for now so models work from the READMEs and the tokens; open the artifact to see them. The READMEs and `SNAPSHOT.md` stay the reference.
- The photos, the lesson fallback image and the PDF toolkit.
- `data-schema.md`. The repo copy is `docs/data-schema.md`, generated from the Payload config; the artifact's copy is published from it. It is the only file in the artifact that the repo overwrites (see `AGENTS.md`).

## Refreshing this snapshot

The artifact can only be read with Claude Code (or Claude on the web), signed in as the owner. Ask it:

> Refresh `docs/design-system/` from the design system artifact: read the same files again (READMEs, `tokens.json`, `design-system.json`, asset READMEs; no previews), replace the ones that changed, update the `lastChange.at` in this file, and tell me whether `sportlab-theme.css` needs a token update.

Then commit the result together with any `sportlab-theme.css` change.
