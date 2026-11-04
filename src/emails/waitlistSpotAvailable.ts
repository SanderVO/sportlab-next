import type { Language } from "@/utilities/messages";
import { emailLayout } from "./layout";

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const copy = {
    nl: {
        subject: "Er is een plek vrijgekomen",
        heading: "Er is een plek vrijgekomen",
        lessonFallback: "de les",
        reserved:
            "De plek is voor jou gereserveerd. Schrijf je in via de knop hieronder.",
        button: "Plek bevestigen",
    },
    en: {
        subject: "A spot has opened up",
        heading: "A spot has opened up",
        lessonFallback: "the lesson",
        reserved: "The spot is reserved for you. Enrol with the button below.",
        button: "Confirm your spot",
    },
} as const;

export const waitlistSpotAvailableSubject = (
    language: Language = "nl",
): string => copy[language].subject;

export const waitlistLessonFallback = (language: Language = "nl"): string =>
    copy[language].lessonFallback;

const intro = (
    language: Language,
    name: string | null | undefined,
    lessonTitle: string,
    lessonDate: string | null | undefined,
): string => {
    const title = `<strong>${escapeHtml(lessonTitle)}</strong>`;
    const date = lessonDate ? escapeHtml(lessonDate) : null;

    if (language === "en") {
        return `${name ? `Hi ${escapeHtml(name)}, a` : "A"} spot has opened up for ${title}${date ? ` on ${date}` : ""}. You were on the waitlist.`;
    }

    return `${name ? `Hoi ${escapeHtml(name)}, er` : "Er"} is een plek vrijgekomen voor ${title}${date ? ` op ${date}` : ""}. Je stond op de wachtlijst.`;
};

export const waitlistSpotAvailableEmail = ({
    name,
    lessonTitle,
    lessonDate,
    url,
    language = "nl",
}: {
    name?: string | null;
    lessonTitle: string;
    lessonDate?: string | null;
    url: string;
    language?: Language;
}): string => {
    const text = copy[language];

    return emailLayout(`<h1 style="margin:0 0 16px;font-size:24px;color:#14110d;">${text.heading}</h1>
                <p style="margin:0 0 16px;">${intro(language, name, lessonTitle, lessonDate)}</p>
                <p style="margin:0 0 16px;">${text.reserved}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                  <tr>
                    <td style="background-color:#e8842b;border-radius:24px;">
                      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#14110d;font-weight:700;text-decoration:none;">${text.button}</a>
                    </td>
                  </tr>
                </table>`);
};
