import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
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
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

// Send contact form email
export const sendContactEmail = async ({ name, email, company, message, submittedAt }) => {
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
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};
