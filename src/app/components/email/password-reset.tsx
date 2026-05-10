import React from "react";

interface PasswordResetEmailProps {
  userFirstName?: string;
  resetLink: string;
  companyName?: string;
  companyLogo?: string;
  supportEmail?: string;
}

export default function PasswordResetEmail({
  userFirstName = "User",
  resetLink,
  companyName = "Event Horizon",
  companyLogo,
}: PasswordResetEmailProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: "1.6",
    color: "#333333",
    backgroundColor: "#ffffff",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "40px 20px 20px",
    borderBottom: "1px solid #e5e7eb",
  };

  const logoStyle: React.CSSProperties = {
    maxHeight: "50px",
    marginBottom: "20px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0",
  };

  const contentStyle: React.CSSProperties = {
    padding: "40px 20px",
  };

  const greetingStyle: React.CSSProperties = {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#374151",
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "16px",
    marginBottom: "30px",
    color: "#6b7280",
    lineHeight: "1.7",
  };

  const buttonContainerStyle: React.CSSProperties = {
    textAlign: "center",
    margin: "40px 0",
  };

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "16px 32px",
    backgroundColor: "#AB4459",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.2s ease",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        {companyLogo && (
          <img
            src={companyLogo}
            alt={`${companyName} Logo`}
            style={logoStyle}
          />
        )}
        <h1 style={titleStyle}>Reset Your Password</h1>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <p style={greetingStyle}>Hi {userFirstName},</p>

        <p style={messageStyle}>
          We received a request to reset your password for your {companyName}{" "}
          account. If you made this request, click the button below to set a new
          password.
        </p>

        <div style={buttonContainerStyle}>
          <a
            href={resetLink}
            style={buttonStyle}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reset Password
          </a>
        </div>
      </div>
    </div>
  );
}
