import nodemailer from "nodemailer";   

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

// PrivateEmail.com SMTP configuration
const smtpOptions = {
  host: process.env.EMAIL_SERVER_HOST || "mail.privateemail.com",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  // Validate email configuration
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    throw new Error("Email server credentials are not configured. Please set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD environment variables.");
  }

  // Log configuration (without sensitive data)
  console.log("Email configuration:", {
    host: smtpOptions.host,
    port: smtpOptions.port,
    secure: smtpOptions.secure,
    user: process.env.EMAIL_SERVER_USER,
    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
    hasPassword: !!process.env.EMAIL_SERVER_PASSWORD,
  });

  const transporter = nodemailer.createTransport({
    ...smtpOptions,
    // Add additional options for better error reporting
    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development",
  });

  // Verify connection before sending
  try {
    await transporter.verify();
    console.log("✓ SMTP server connection verified");
  } catch (verifyError: any) {
    console.error("✗ SMTP server connection failed:", {
      error: verifyError.message,
      code: verifyError.code,
      command: verifyError.command,
      response: verifyError.response,
    });
    throw new Error(`SMTP connection failed: ${verifyError.message}`);
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
      to: Array.isArray(data.to) ? data.to.join(", ") : data.to,
      replyTo: data.replyTo,
      subject: data.subject,
      html: data.html,
    });

    console.log("Email sent successfully:", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });

    return result;
  } catch (sendError: any) {
    console.error("Email send failed:", {
      error: sendError.message,
      code: sendError.code,
      command: sendError.command,
      response: sendError.response,
      responseCode: sendError.responseCode,
    });
    throw sendError;
  }
};

export const formatEmail = (email: string) => {
  return email.replace(/\s+/g, "").toLowerCase().trim();
};

