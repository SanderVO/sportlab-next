// Email clients ignore external CSS, so brand colors are inlined (see docs/style-guide.md).
export const emailLayout = (content: string): string => `<!DOCTYPE html>
<html lang="nl">
  <body style="margin:0;padding:0;background-color:#e8e0ce;font-family:Montserrat,Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e0ce;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#f6f2ea;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="background-color:#14110d;padding:24px 32px;color:#f6f2ea;font-size:20px;font-weight:700;letter-spacing:1px;">
                SPORTLAB
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#14110d;font-size:16px;line-height:1.6;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
