import { emailLayout } from "./layout";

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const waitlistSpotAvailableSubject = "Er is een plek vrijgekomen";

export const waitlistSpotAvailableEmail = ({
    name,
    lessonTitle,
    lessonDate,
    url,
}: {
    name?: string | null;
    lessonTitle: string;
    lessonDate?: string | null;
    url: string;
}): string =>
    emailLayout(`<h1 style="margin:0 0 16px;font-size:24px;color:#14110d;">Er is een plek vrijgekomen</h1>
                <p style="margin:0 0 16px;">${name ? `Hoi ${escapeHtml(name)}, er` : "Er"} is een plek vrijgekomen voor <strong>${escapeHtml(lessonTitle)}</strong>${lessonDate ? ` op ${escapeHtml(lessonDate)}` : ""}. Je stond op de wachtlijst.</p>
                <p style="margin:0 0 16px;">De plek is voor jou gereserveerd. Schrijf je in via de knop hieronder.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                  <tr>
                    <td style="background-color:#e8842b;border-radius:24px;">
                      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#14110d;font-weight:700;text-decoration:none;">Plek bevestigen</a>
                    </td>
                  </tr>
                </table>`);
