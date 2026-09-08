import nodemailer, { type Transporter } from 'nodemailer';
import logger from './logger.js';

// Create reusable transporter
let transporter: Transporter | null = null;

const createTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

// Format date
const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

interface ContactEmailParams {
  name: string;
  email: string;
  company?: string;
  message: string;
  submittedAt: Date | string;
}

// Send contact form email
export const sendContactEmail = async ({ name, email, company, message, submittedAt }: ContactEmailParams) => {
  const transporter = createTransporter();

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .field {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          color: #667eea;
          display: block;
          margin-bottom: 5px;
        }
        .value {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #667eea;
        }
        .message-box {
          background: #f0f4ff;
          padding: 15px;
          border-radius: 4px;
          border-left: 3px solid #764ba2;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>AlphaGen Solutions</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">👤 Name:</span>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <span class="label">✉️ Email:</span>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>

          ${company ? `
          <div class="field">
            <span class="label">🏢 Company:</span>
            <div class="value">${company}</div>
          </div>
          ` : ''}

          <div class="field">
            <span class="label">💬 Message:</span>
            <div class="message-box">${message}</div>
          </div>

          <div class="field">
            <span class="label">🕐 Submitted:</span>
            <div class="value">${formatDate(submittedAt)}</div>
          </div>

          <div class="footer">
            <p>This email was sent from the AlphaGen Solutions contact form.</p>
            <p>Please respond to <a href="mailto:${email}">${email}</a> to continue the conversation.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
New Contact Form Submission - AlphaGen Solutions

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
${message}

Submitted: ${formatDate(submittedAt)}

---
Please respond to ${email} to continue the conversation.
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Contact Form: ${name}${company ? ` from ${company}` : ''}`,
    text: emailText,
    html: emailHTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId }, 'Email sent');
    return info;
  } catch (error) {
    logger.error({ err: error }, 'Email sending error');
    throw error;
  }
};

interface PasswordResetEmailParams {
  to: string;
  firstName: string;
  resetUrl: string;
}

// Send password reset link
export const sendPasswordResetEmail = async ({ to, firstName, resetUrl }: PasswordResetEmailParams) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Reset your AlphaGen Solutions password',
    text: `Hi ${firstName},

We received a request to reset your password. Use the link below within 1 hour:

${resetUrl}

If you didn't request this, you can safely ignore this email — your password will not change.

— AlphaGen Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #667eea;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below within <strong>1 hour</strong>:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </p>
        <p style="font-size: 12px; color: #666;">If the button doesn't work, copy this link: <br>${resetUrl}</p>
        <p style="font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email — your password will not change.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email service is ready to send messages');
    return true;
  } catch (error) {
    logger.error({ err: error instanceof Error ? error.message : error }, 'Email service verification failed');
    return false;
  }
};
