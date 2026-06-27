export type TemplateParams = {
  name?: string;
  resetLink: string;
  companyName?: string;
  currentYear?: number;
};

export const resetLinkTemplate = ({
  name,
  resetLink,
  companyName = 'route.io',
  currentYear = new Date().getFullYear(),
}: TemplateParams): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header / Logo Area -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">${companyName}</h1>
            </td>
          </tr>

          <!-- Email Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">Hello${name},</p>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #333333;">We received a request to reset the password for your account. Click the button below to choose a new password.</p>
              
              <!-- Call to Action Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center" style="background-color: #2563eb; border-radius: 6px;">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <!-- Expiration Warning -->
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 20px; color: #666666; font-style: italic;">This link will expire in 60 minutes. If you did not request this change, you can safely ignore this email.</p>
              
              <!-- Divider line -->
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px 0;">
              
              <!-- Fallback Link -->
              <p style="margin: 0; font-size: 13px; line-height: 18px; color: #888888; word-break: break-all;">If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
                <a href="${resetLink}" target="_blank" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td align="center" style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 16px; color: #9ca3af;">&copy; ${currentYear} ${companyName}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
