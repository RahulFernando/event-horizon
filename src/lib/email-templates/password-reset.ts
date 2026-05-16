interface PasswordResetEmailProps {
  userFirstName?: string;
  resetLink: string;
  companyName?: string;
}

export function passwordResetHtml({
  userFirstName = "User",
  resetLink,
  companyName = "Event Horizon",
}: PasswordResetEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#333333;background-color:#ffffff;">
    <div style="text-align:center;padding:40px 20px 20px;border-bottom:1px solid #e5e7eb;">
      <h1 style="font-size:28px;font-weight:600;color:#1f2937;margin:0;">Reset Your Password</h1>
    </div>
    <div style="padding:40px 20px;">
      <p style="font-size:18px;margin-bottom:20px;color:#374151;">Hi ${userFirstName},</p>
      <p style="font-size:16px;margin-bottom:30px;color:#6b7280;line-height:1.7;">
        We received a request to reset your password for your ${companyName} account.
        If you made this request, click the button below to set a new password.
      </p>
      <div style="text-align:center;margin:40px 0;">
        <a href="${resetLink}" style="display:inline-block;padding:16px 32px;background-color:#AB4459;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;" target="_blank" rel="noopener noreferrer">
          Reset Password
        </a>
      </div>
      <p style="font-size:14px;color:#9ca3af;margin-top:40px;">
        If you didn't request a password reset, you can safely ignore this email.
        This link will expire in 24 hours.
      </p>
    </div>
    <div style="text-align:center;padding:20px;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
