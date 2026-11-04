import type { Language } from "@/utilities/messages";
import { emailLayout } from "./layout";

const copy = {
    nl: {
        subject: "Wachtwoord resetten",
        heading: "Wachtwoord resetten",
        intro: "Je hebt gevraagd om je wachtwoord te resetten. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.",
        button: "Nieuw wachtwoord instellen",
        fallback: "Werkt de knop niet? Kopieer dan deze link naar je browser:",
        ignore: "Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.",
    },
    en: {
        subject: "Reset your password",
        heading: "Reset your password",
        intro: "You asked to reset your password. Click the button below to set a new password.",
        button: "Set a new password",
        fallback: "Doesn't the button work? Copy this link into your browser:",
        ignore: "Didn't ask for this? Then you can ignore this email.",
    },
} as const;

export const resetPasswordSubject = (language: Language = "nl"): string =>
    copy[language].subject;

export const resetPasswordEmail = (
    resetURL: string,
    language: Language = "nl",
): string => {
    const text = copy[language];

    return emailLayout(`<h1 style="margin:0 0 16px;font-size:24px;color:#14110d;">${text.heading}</h1>
                <p style="margin:0 0 16px;">${text.intro}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                  <tr>
                    <td style="background-color:#e8842b;border-radius:24px;">
                      <a href="${resetURL}" style="display:inline-block;padding:14px 32px;color:#14110d;font-weight:700;text-decoration:none;">${text.button}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:14px;color:#46555f;">${text.fallback}</p>
                <p style="margin:0 0 16px;font-size:14px;word-break:break-all;"><a href="${resetURL}" style="color:#d7741f;">${resetURL}</a></p>
                <p style="margin:0;font-size:14px;color:#46555f;">${text.ignore}</p>`);
};
