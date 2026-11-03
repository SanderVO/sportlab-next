# Credits

The member's credits on Lessen: group lessons per month and personal training per week, each with what's left, a bar and when it's topped up.

**Consumer provides:** the member's current `subscriptions` doc and its `plan` (`subscription-plans`: `groupCreditsPerMonth`, `ptCreditsPerWeek`; `0` means the plan doesn't include that type), the credits used in the current month and week, and this period's `credit-adjustments` (`creditType`, `amount`, `source`, `reason`, `addedBy`). Fields: see `subscription-plans`, `subscriptions`, `credit-adjustments` and `lesson-enrollments` (`cancelledAt`) in `data-schema.md`.

- `.app-credits` (a `warm-white` card with a `line` border) > eyebrow "Je credits" > `.app-credits-grid` with one `.app-credit` per credit type the member has: **Groepslessen** (period: the month, "November") and **Personal training** (period: "Deze week").
- **Per type:** the number left in Anton (`.app-credit-v b`, 48px; 40px on phones) with "van 9 over". Then `.app-segs` with `--n` = the total, one `i` per credit (`.on` = used: completed, planned or late-cancelled). Under it one line: "1 gepland · weer aangevuld op 1 december" or "… weer 2 op maandag 9 november".
- **Credit adjustments:** `.x` with Lucide `circle-plus`, for adjustments in this period and type. `source` `manual` names who did it: "Inclusief 1 extra credit van Jesse" (first name of `addedBy`). `stripe` and `system` adjustments have no person: "Inclusief 1 extra credit". A negative `amount` reads "1 credit minder (Jesse)". `reason` is for the full history under Ik › Abonnement, not for this card.
- **Out of credits:** `.app-credit-out` (`sand`): "Je PT-credits voor deze week zijn op." plus when they come back and what can still be booked. Never orange, never red.
- **Not in the subscription:** the plan has `0` for that type, or the member has no subscription. Keep the type with `.none` "Zit niet in je abonnement." (web adds "Vraag je coach naar de mogelijkheden."). Leave the type out completely only when the gym doesn't offer it at all.
- **Footer:** "Open gym kost geen credit. Meld je uiterlijk 5 minuten voor de les af, dan krijg je je credit terug. Een wachtlijstplek kost pas een credit als je hem bevestigt." plus "Bekijk je credits en abonnement →" (`.web-link`).
- **Phone:** the two types sit side by side (`.app-credits-grid` becomes two columns), the explanation lines shorten ("Weer op 1 december"), and the footer is one line.
- The bar is decorative next to the number; it carries an `aria-label` ("1 van 9 groepscredits gebruikt, 8 over").

## Rules

- **Type of a lesson:** `group` → groepscredit · `pt` and `semi_pt` → PT-credit · `open_gym` → no credit.
- **Periods:** group credits per calendar month, PT credits per week (Monday–Sunday), both in Europe/Amsterdam. A credit belongs to the period of `lesson.startDate`, not of the booking. An adjustment is entered with any `date` in the target period; `periodStart` and `periodEnd` are filled in automatically.
- **Used** in a period = enrollments of that credit type with status `assigned`, `started` or `completed`, plus `cancelled` ones whose `cancelledAt` is less than 5 minutes before `lesson.startDate` (no refund). `cancelledAt` is set automatically when the status becomes `cancelled`. A `cancelled` enrollment without `cancelledAt` (cancelled before the field existed) counts as refunded. `waitlisted` doesn't count until the member confirms the spot.
- **Left** = the plan's credits for the period + the sum of `credit-adjustments.amount` for that member, `creditType` and period − used. The plan only gives credits while the subscription's `status` is `active` or `trialing`.
- **Booking:** a booking, or confirming a waitlist spot, is refused when left is 0. Open gym needs no credit.
- **No carry-over:** unused group credits expire at the end of the month.
