# Login

The sign-in screen for the member area, on web and in the app: a photo panel with the one campaign line, and a short form.

**Consumer provides:** the auth action (Payload `members` login), the forgot-password link (Payload reset flow), the proefles link for non-members and any error message.

- **Web:** `.app-login`, two halves that wrap on narrow screens. Left `.app-login-photo` with `high-five-after-class.jpg`, a top and bottom shade, the `SPORTLAB` wordmark and the kapstok once: eyebrow "ONE MORE REASON" + "TO KEEP GOING." in Anton 72px. Right `.app-login-form`: eyebrow, `app-h1` "Welkom terug.", one muted line, the fields, "Ingelogd blijven", the orange "Inloggen" (full width, 52px), a rule and the proefles link.
- **App (and web below 768px):** the photo becomes a 312px header with the line at 44px; the form is a sheet that overlaps it by 16px. "Ingelogd blijven" is dropped (the app stays signed in) and "Wachtwoord vergeten?" moves under the button.
- **Fields:** `.app-field` with the label above, `.app-input` (52px, 16px text so iOS doesn't zoom, `control-border` on `warm-white`). The password toggle is an `eye` icon button (`aria-label="Wachtwoord tonen"`, 44px).
- **Orange:** only "Inloggen". The proefles link is a `.web-link` in `ink`.
- **Errors:** a short Dutch line under the field in `ink` 14px ("Dit e-mailadres en wachtwoord horen niet bij elkaar."), and keep what was typed. Never only a red border.
- App: offer Face ID / fingerprint after the first login through the platform's own prompt; no custom UI needed.
