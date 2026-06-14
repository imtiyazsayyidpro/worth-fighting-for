type VerificationEmailParams = {
  displayName: string;
  verifyUrl: string;
};

export function verificationEmail({ displayName, verifyUrl }: VerificationEmailParams) {
  const firstName = displayName.split(/\s+/)[0];

  const subject = "Verify your email — Worth Fighting For";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;padding:48px 40px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          <tr>
            <td style="text-align:center;padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:600;color:#1a1a1a;letter-spacing:-0.3px;">Worth Fighting For</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0 0 16px;font-size:16px;color:#2d2d2d;line-height:1.6;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;font-size:16px;color:#2d2d2d;line-height:1.6;">
                Thank you for joining Worth Fighting For — a quiet, guided space for the conversations that matter most.
              </p>
              <p style="margin:0 0 32px;font-size:16px;color:#2d2d2d;line-height:1.6;">
                Please verify your email address to get started. This link expires in 24 hours.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:#b76e79;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.1px;">
                      Verify my email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;font-size:13px;color:#888;line-height:1.6;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#aaa;line-height:1.6;word-break:break-all;">
                Or copy this link into your browser:<br/>
                <a href="${verifyUrl}" style="color:#b76e79;">${verifyUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const text = `Hi ${firstName},

Thank you for joining Worth Fighting For.

Please verify your email address by visiting the link below (expires in 24 hours):

${verifyUrl}

If you didn't create an account, you can safely ignore this email.

— Worth Fighting For`;

  return { subject, html, text };
}
