# Credits

The member's credits on Lessen: group lessons per month and personal training per week, each with what's left, a bar and when it's topped up.

**Consumer provides:** the member's `subscription` (`groupCreditsPerMonth`, `ptCreditsPerWeek`; either can be 0 or missing), the credits used in the current month and week, and this period's `credit-adjustments` (amount, `addedBy`). See *Credits* in `data-schema.md`.

- `.app-credits` (a `warm-white` card with a `line` border) > eyebrow "Je credits" > `.app-credits-grid` with one `.app-credit` per credit type the member has: **Groepslessen** (period: the month, "November") and **Personal training** (period: "Deze week").
- **Per type:** the number left in Anton (`.app-credit-v b`, 48px; 40px on phones) with "van 9 over". Then `.app-segs` with `--n` = the total, one `i` per credit (`.on` = used: completed, planned or late-cancelled). Under it one line: "1 gepland · weer aangevuld op 1 december" or "… weer 2 op maandag 9 november".
- **Manual credits:** `.x` with Lucide `circle-plus`: "Inclusief 1 extra credit van Jesse". Use the first name of `addedBy`. Removed credits read "1 credit minder (Jesse)". The full history is under Ik › Abonnement.
- **Out of credits:** `.app-credit-out` (`sand`): "Je PT-credits voor deze week zijn op." plus when they come back and what can still be booked. Never orange, never red.
- **Not in the subscription:** keep the type with `.none` "Zit niet in je abonnement." (web adds "Vraag je coach naar de mogelijkheden."). Leave the type out completely only when the gym doesn't offer it at all.
- **Footer:** "Open gym kost geen credit. Meld je uiterlijk 5 minuten voor de les af, dan krijg je je credit terug. Een wachtlijstplek kost pas een credit als je hem bevestigt." plus "Bekijk je credits en abonnement →" (`.web-link`).
- **Phone:** the two types sit side by side (`.app-credits-grid` becomes two columns), the explanation lines shorten ("Weer op 1 december"), and the footer is one line.
- The bar is decorative next to the number; it carries an `aria-label` ("1 van 9 groepscredits gebruikt, 8 over").
