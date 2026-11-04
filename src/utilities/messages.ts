/**
 * Messages the system sends back to people, in Dutch and English.
 *
 * - Messages and texts in Payload itself (the CMS and its validation errors) use Payload's own
 *   language: the one chosen in the CMS, a cookie of the current browser, else the browser's
 *   language. This applies to the current session and browser only.
 * - Everything members get (booking refusals, the member actions, emails) uses the language saved
 *   on the user. It is always set, Dutch by default. Someone without an account gets Dutch.
 * - Staff (admins, editors, coaches) work in Payload, so the messages they trigger there follow
 *   Payload's language.
 */

import { rolesOf } from "@/access/rolesOf";
import { RolesEnum } from "@/collections/Users/roles";

export type Language = "nl" | "en";

export const LANGUAGES: readonly Language[] = ["nl", "en"];

export const DEFAULT_LANGUAGE: Language = "nl";

const isLanguage = (value: unknown): value is Language =>
    LANGUAGES.some((language) => language === value);

/** The language of the request: the Payload language cookie, else the browser's preferred language. */
export const requestLanguage = (
    headers: Headers | null | undefined,
): Language | null => {
    if (!headers) return null;

    const cookie = headers
        .get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("payload-lng="))
        ?.slice("payload-lng=".length);

    if (isLanguage(cookie)) return cookie;

    const preferred = headers
        .get("accept-language")
        ?.split(",")[0]
        ?.trim()
        .slice(0, 2)
        .toLowerCase();

    return isLanguage(preferred) ? preferred : null;
};

/**
 * The language to answer someone in. Staff get Payload's language, because they work in the CMS;
 * everyone else gets the language saved on their account, else Dutch.
 */
export const languageOf = (
    user: unknown,
    headers?: Headers | null,
): Language => {
    // `req.user` can also be an MCP API key document, which has no language.
    const saved =
        user && typeof user === "object" && "language" in user
            ? user.language
            : null;
    const savedLanguage = isLanguage(saved) ? saved : DEFAULT_LANGUAGE;
    const roles = rolesOf(user);
    const isStaff =
        roles.includes(RolesEnum.ADMIN) ||
        roles.includes(RolesEnum.EDITOR) ||
        roles.includes(RolesEnum.COACH);

    return isStaff
        ? (requestLanguage(headers) ?? savedLanguage)
        : savedLanguage;
};

/** The language of the admin screen, for messages meant for staff. */
export const adminLanguage = (headers?: Headers | null): Language =>
    requestLanguage(headers) ?? DEFAULT_LANGUAGE;

const catalog = {
    genericError: {
        nl: "Er ging iets mis. Probeer het opnieuw.",
        en: "Something went wrong. Please try again.",
    },
    notSignedIn: {
        nl: "Je bent niet ingelogd.",
        en: "You're not signed in.",
    },
    lessonNotFound: {
        nl: "Deze les bestaat niet.",
        en: "This lesson doesn't exist.",
    },
    lessonOver: {
        nl: "Deze les is al afgelopen.",
        en: "This lesson has already ended.",
    },
    spotsAvailable: {
        nl: "Er zijn nog plekken beschikbaar in deze les.",
        en: "There are still spots available in this lesson.",
    },
    alreadyOnWaitlist: {
        nl: "Je staat al op de wachtlijst.",
        en: "You're already on the waitlist.",
    },
    alreadyEnrolled: {
        nl: "Je bent al ingeschreven voor deze les.",
        en: "You're already enrolled in this lesson.",
    },
    noSpotYet: {
        nl: "Er is nog geen plek voor je vrijgekomen.",
        en: "No spot has opened up for you yet.",
    },
    lessonFull: {
        nl: "Deze les is vol. Je kunt je op de wachtlijst zetten.",
        en: "This lesson is full. You can join the waitlist.",
    },
    notInSubscription: {
        nl: "Dit zit niet in je abonnement.",
        en: "This isn't included in your subscription.",
    },
    subscriptionInactive: {
        nl: "Je abonnement is niet actief.",
        en: "Your subscription isn't active.",
    },
    noGroupCredits: {
        nl: "Je hebt geen groepscredits meer voor {period}.",
        en: "You have no group credits left for {period}.",
    },
    noPtCredits: {
        nl: "Je hebt geen PT-credits meer voor {period}.",
        en: "You have no PT credits left for {period}.",
    },
    turnstileUnavailable: {
        nl: "Formulier tijdelijk niet beschikbaar.",
        en: "The form is temporarily unavailable.",
    },
    turnstileRequired: {
        nl: "Bevestig dat je geen robot bent.",
        en: "Please confirm that you're not a robot.",
    },
    turnstileFailed: {
        nl: "Verificatie mislukt, probeer het opnieuw.",
        en: "Verification failed, please try again.",
    },
    subscriptionOfOtherMember: {
        nl: "Dit abonnement hoort bij een ander lid.",
        en: "This subscription belongs to another member.",
    },
    priceOfOtherPlan: {
        nl: "Dit tarief hoort bij een ander abonnementplan.",
        en: "This price belongs to another subscription plan.",
    },
    planHasMembers: {
        nl: "Dit plan is nog aan leden gekoppeld. Zet het plan op inactief in plaats van het te verwijderen.",
        en: "This plan is still linked to members. Set the plan to inactive instead of deleting it.",
    },
    planHasPrices: {
        nl: "Dit plan heeft nog tarieven. Zet het plan op inactief in plaats van het te verwijderen.",
        en: "This plan still has prices. Set the plan to inactive instead of deleting it.",
    },
    priceInUse: {
        nl: "Dit tarief is nog gekoppeld aan een abonnement of is het huidige tarief van een plan. Zet het tarief op inactief in plaats van het te verwijderen.",
        en: "This price is still linked to a subscription or is a plan's current price. Set the price to inactive instead of deleting it.",
    },
} as const satisfies Record<string, Record<Language, string>>;

export type MessageKey = keyof typeof catalog;

export const message = (
    language: Language,
    key: MessageKey,
    vars?: Record<string, string>,
): string =>
    Object.entries(vars ?? {}).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        catalog[key][language] as string,
    );

/** The month or week a credit refusal is about: "november" / "de week van 9 november". */
export const creditPeriodLabel = (
    language: Language,
    creditType: "group" | "pt",
    periodStart: Date,
): string => {
    const locale = language === "nl" ? "nl-NL" : "en-GB";
    const format = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, {
            timeZone: "Europe/Amsterdam",
            ...options,
        }).format(periodStart);

    if (creditType === "group") {
        return language === "nl"
            ? format({ month: "long" })
            : format({ month: "long" }).replace(/^./, (c) => c.toUpperCase());
    }

    const day = format({ day: "numeric", month: "long" });

    return language === "nl" ? `de week van ${day}` : `the week of ${day}`;
};
