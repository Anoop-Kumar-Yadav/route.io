type TemplateParams = {
  name?: string;
  supportLink?: string;
  companyName?: string;
  currentYear?: number;
};

export const passwordResetInfoTemplate = ({
  name,
  supportLink,
  companyName = 'route.io',
  currentYear = new Date().getFullYear(),
}: TemplateParams) => {
  // Fallback defaults for optional fields
  const displayName = name ? ` ${name}` : '';
  const displayCompany = companyName;
  const displayYear = currentYear;
  const displaySupportLink = supportLink || '#';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header / Logo Area -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">${displayCompany}</h1>
            </td>
          </tr>

          <!-- Email Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">Hello${displayName},</p>
              
              <!-- Success Alert Banner -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 15px; line-height: 22px; color: #14532d; font-weight: 500;">
                      Your account password has been successfully updated.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">This is an automated confirmation that your password was recently changed. You can now log back into your account using your new credentials.</p>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #333333;">If you made this change, no further action is required from you.</p>
              
              <!-- Security Warning Indicator -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #9a3412; font-weight: 600;">Didn't make this change?</h4>
                    <p style="margin: 0; font-size: 13px; line-height: 18px; color: #c2410c;">
                      If you did not request a password reset, your account might be compromised. Please <a href="${displaySupportLink}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: underline;">contact our support team immediately</a> to secure your account.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Divider line -->
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px 0;">
              
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666666;">Best regards,<br>The ${displayCompany} Team</p>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td align="center" style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; font-size: 12px; line-height: 16px; color: #9ca3af;">&copy; ${displayYear} ${displayCompany}. All rights reserved.</p>
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
