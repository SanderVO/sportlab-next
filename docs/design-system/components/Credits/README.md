# Credits

The member's credits on Lessen: group lessons per month and personal training per week, each with what's left, a bar and when it's topped up.

**Consumer provides:** the member's current `subscriptions` doc and its `plan` (`subscription-plans`: `groupCreditsPerMonth`, `ptCreditsPerWeek`; `0` means the plan doesn't include that type), the credits used in the current month and week, and this period's `credit-adjustments` (`creditType`, `amount`, `source`, `reason`, `addedBy`). Fields: see `subscription-plans`, `subscriptions`, `credit-adjustments` and `lesson-enrollments` (`cancelledAt`) in `data-schema.md`.

- `.app-credits` (a `warm-white` card with a `line` border) > eyebrow "Je credits" > `.app-credits-grid` with one `.app-credit` per credit type the member has: **Groepslessen** (period: the month, "November") and **Personal training** (period: "Deze week").
- **Per type:** the number left in Anton (`.app-credit-v b`, 48px; 40px on phones) with "van 9 over". Then `.app-segs` with `--n` = the total, one `i` per credit (`.on` = used: completed, planned or late-cancelled). Under it one line: "1 gepland · weer aangevuld op 1 december" or "… weer 2 op maandag 9 november".
- **Credit adjustments:** `.x` with Lucide `circle-plus`, for adjustments in this period and type. `source` `manual` names who did it: "Inclusief 1 extra credit van Jesse" (first name of `addedBy`). `stripe` and `system` adjustments have no person: "Inclusief 1 extra credit". A negative `amount` reads "1 credit minder (Jesse)". `reason` is for the full history under Ik › Abonnement, not for this card.
- **Out of credits:** `.app-credit-out` (`sand`): "Je PT-credits voor deze week zijn op." plus when they come back and what can still be booked. Never orange, never red.
- **Subscription not active:** the member has a subscription, but its latest `status` isn't `active` or `trialing` (`past_due`, `unpaid`, `paused`, `incomplete`, `incomplete_expired`, `canceled`), so the plan gives no credits. Show one `.app-credit-out` box (`sand`, the same box as out of credits) instead of the two types, with the title "Je abonnement is niet actief." and one line for the status:
  - `past_due`, `unpaid`: "Je laatste betaling is niet gelukt. Zodra die klopt, staan je credits weer klaar."
  - `paused`: "Je abonnement staat op pauze. Je credits komen terug zodra je weer start."
  - `incomplete`, `incomplete_expired`: "Je abonnement is nog niet afgerond."
  - `canceled`: "Je abonnement is beëindigd. Vraag je coach naar de mogelijkheden."

  Under it "Bekijk je abonnement →" (`.web-link`). No bars or numbers, never orange or red. A type that still has credits from a credit adjustment is shown above the box as usual. This is not "Niet in abonnement": that means no subscription at all, or a plan that doesn't include the type.
- **Not in the subscription:** the plan has `0` for that type, or the member has no subscription. Keep the type with `.none` "Zit niet in je abonnement." (web adds "Vraag je coach naar de mogelijkheden."). Leave the type out completely only when the gym doesn't offer it at all.
- **Footer:** "Open gym kost geen credit. Meld je uiterlijk 5 minuten voor de les af, dan krijg je je credit terug. Een wachtlijstplek kost pas een credit als je hem bevestigt." plus "Bekijk je credits en abonnement →" (`.web-link`).
- **Phone:** the two types sit side by side (`.app-credits-grid` becomes two columns), the explanation lines shorten ("Weer op 1 december"), and the footer is one line.
- The bar is decorative next to the number; it carries an `aria-label` ("1 van 9 groepscredits gebruikt, 8 over").

## Rules

- **Type of a lesson:** `group` → groepscredit · `pt` and `semi_pt` → PT-credit · `open_gym` → no credit.
- **Periods:** group credits per calendar month, PT credits per week (Monday–Sunday), both in Europe/Amsterdam. A credit belongs to the period of `lesson.startDate`, not of the booking. An adjustment is entered with any `date` in the target period; `periodStart` and `periodEnd` are filled in automatically.
- **Used** in a period = enrollments of that credit type with status `assigned`, `started` or `completed`, plus `cancelled` ones whose `cancelledAt` is less than 5 minutes before `lesson.startDate` (no refund). `cancelledAt` is set automatically when the status becomes `cancelled`. A `cancelled` enrollment without `cancelledAt` (cancelled before the field existed) counts as refunded. `waitlisted` doesn't count until the member confirms the spot.
- **Left** = the plan's credits for the period + the sum of `credit-adjustments.amount` for that member, `creditType` and period − used. The plan only gives credits while the subscription's `status` is `active` or `trialing`; credit adjustments count either way. If a member has more than one subscription, the most recent one that gives credits is used.
- **Booking:** a booking, or confirming a waitlist spot, is refused when left is 0. Open gym needs no credit, and joining the waitlist costs nothing. Taking up an enrollment that was cancelled too late costs no extra credit, because that credit was never given back. Admins and coaches can book a member in without credits; the credit is then used as usual.
- **Waitlist:** a free spot is only offered to the first waitlisted member who has a credit for it. Members without one keep their place and are offered the next free spot, or one as soon as their credits change (a credit adjustment, a subscription that becomes active). Offering a spot costs no credit; confirming it does.
- **Refusal texts**, in the member's saved language (`users.language`: `nl` or `en`, always set, Dutch by default). The language chosen in the CMS only applies to the CMS itself, and staff working in the CMS see messages in that language:

| Dutch | English |
|---|---|
| Je abonnement is niet actief. | Your subscription isn't active. |
| Dit zit niet in je abonnement. | This isn't included in your subscription. |
| Je hebt geen groepscredits meer voor november. | You have no group credits left for November. |
| Je hebt geen PT-credits meer voor de week van 9 november. | You have no PT credits left for the week of 9 November. |
| Deze les is vol. Je kunt je op de wachtlijst zetten. | This lesson is full. You can join the waitlist. |
| Er is nog geen plek voor je vrijgekomen. | No spot has opened up for you yet. |
- **No carry-over:** unused group credits expire at the end of the month.
