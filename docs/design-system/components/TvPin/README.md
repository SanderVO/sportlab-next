# TvPin

The lock screen in front of the /tv dashboard: staff type a 4-digit code with the remote before the day overview opens.

**Consumer provides:** the check of the code (server-side, never in the page), the number of attempts left, the lockout time left, and where to go after a correct code (`/tv`, or the page that was asked for).

- Frame: `.tv-screen.sl-dark`, 1920×1080. Top bar: `SPORTLAB` wordmark (`.tv-wm`) and the clock (`.tv-clock`), like TvSchedule.
- Layout: `.tv-pin-body`, two columns (`1fr` / 576px, 120px apart), vertically centred; footer `.tv-pin-ft` with two `tv-eyebrow` lines (key hint left, "Blijft ontgrendeld op deze tv" right).
  - **Left:** eyebrow in `sand` ("TV-dashboard · Alleen voor het team"), `tv-title` "Voer de code in", one `tv-body` line ("Vier cijfers. Weet je de code niet? Vraag het een coach."), then the four slots and the status line.
  - **Right:** the keypad `.tv-pin-pad`, 3×4 keys of 120px: 1–9, then `←` (delete one digit), 0 and `Wis` (clear all). Digits are Anton 64px on `charcoal`; `←` and `Wis` are `.tv-pin-key.txt` (Poppins 600 34px, outlined).
- Slots: `.tv-pin-slot`, 168×200px, `radius-tv`. **Digits are always masked** as a 40px dot (`.tv-pin-dot`): the screen hangs in the gym.
  - `.active`: the next empty slot, `orange-300` border plus a 6px underline.
  - `.error`: all four `orange-300` with `orange-200` dots, after a wrong code.
  - `.ok`: `sand` border and dots, while the dashboard opens.
  - `.locked`: dimmed to 45% during a lockout.
- Status line `.tv-pin-status` (`role="status"`, `aria-live="polite"`), fixed at 144px so nothing jumps:
  - Typing: `tv-eyebrow` "2 / 4 cijfers".
  - **Wrong code:** `.tv-pin-alert` with `.mark` "!", `.title` "Deze code klopt niet." (Anton 52px) and `.text` "Probeer het opnieuw. Nog 2 pogingen." in `orange-200`. Singular at one left: "Nog 1 poging.". The next key press clears the slots and starts over.
  - **Too many attempts** (5 wrong codes): the same alert with "Te veel pogingen." and "Probeer het over **00:58** opnieuw." (the time in Anton 40px, counting down). Keys get `disabled`. After the countdown, back to typing with all attempts.
  - **Correct:** `.tv-pin-alert.ok`, `sand` instead of orange, `.mark` "→", "Code klopt." and "Het dashboard wordt geopend.".
- The error is carried by the "!" mark and the sentence, never by colour alone. There is no red in the system; the orange tints are the TV's alert colour.
- No solid `cta` on this screen: the code is checked automatically after the 4th digit, so there is no action button.
- Remote: digits 0–9 on the remote fill the slots directly; arrows move over the keypad and OK presses the focused key (`.tv-focusable`, 6px `focus-ring`); Back deletes one digit. Show the hint in the footer: "0–9 typen · pijltjes en OK kiezen · ← wist een cijfer".
- Security: compare the code on the server and rate-limit there too (5 tries, then 60 seconds), because 4 digits are quick to guess. After a correct code, set an httpOnly cookie so that TV stays unlocked; changing the code in Payload signs every TV out.
