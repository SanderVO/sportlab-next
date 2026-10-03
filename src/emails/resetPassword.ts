import { emailLayout } from "./layout";

export const resetPasswordSubject = "Wachtwoord resetten";

export const resetPasswordEmail = (resetURL: string): string =>
    emailLayout(`<h1 style="margin:0 0 16px;font-size:24px;color:#14110d;">Wachtwoord resetten</h1>
                <p style="margin:0 0 16px;">Je hebt gevraagd om je wachtwoord te resetten. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                  <tr>
                    <td style="background-color:#e8842b;border-radius:24px;">
                      <a href="${resetURL}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-weight:700;text-decoration:none;">Nieuw wachtwoord instellen</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:14px;color:#46555f;">Werkt de knop niet? Kopieer dan deze link naar je browser:</p>
                <p style="margin:0 0 16px;font-size:14px;word-break:break-all;"><a href="${resetURL}" style="color:#d7741f;">${resetURL}</a></p>
                <p style="margin:0;font-size:14px;color:#46555f;">Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.</p>`);
