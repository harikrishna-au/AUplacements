const nodemailer = require('nodemailer');

// Create transporter - Configure with your Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD // Your Gmail App Password (not regular password)
  }
});

/**
 * Send magic link email to student
 */
async function sendMagicLinkEmail(email, fullName, magicLink) {
  try {
    const mailOptions = {
      from: `"AU Placements" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your Login Link - AU Placements Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #5568d3; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 AU Placements Portal</h1>
            </div>
            <div class="content">
              <h2>Hello, ${fullName}!</h2>
              <p>You requested to login to the AU Placements Portal. Click the button below to access your account:</p>
              
              <div style="text-align: center;">
                <a href="${magicLink}" class="button">
                  🔓 Login to Portal
                </a>
              </div>

              <div class="warning">
                <strong>⚠️ Security Note:</strong>
                <ul style="margin: 10px 0;">
                  <li>This link is valid for <strong>15 minutes</strong></li>
                  <li>It can only be used <strong>once</strong></li>
                  <li>Don't share this link with anyone</li>
                </ul>
              </div>

              <p>If you didn't request this login link, you can safely ignore this email.</p>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="color: #666; font-size: 14px;">
                <strong>Having trouble?</strong><br>
                Copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #667eea;">${magicLink}</span>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Andhra University - Placements Portal</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️  Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send email: ' + error.message);
  }
}

/**
 * Verify email configuration
 */
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
}

module.exports = {
  sendMagicLinkEmail,
  verifyEmailConfig
};
