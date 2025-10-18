const nodemailer = require('nodemailer');

function buildEmailHtml(fullName, magicLink) {
  return `
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
              <li>Do not share this link with anyone</li>
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
  `;
}

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      // Optimize for production
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 20000, // 20 seconds
      rateLimit: 5, // 5 emails per rateDelta
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });
  }
  return transporter;
}

async function sendMagicLinkEmail(email, fullName, magicLink) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Gmail not configured. Set EMAIL_USER and EMAIL_PASSWORD environment variables.');
  }

  console.log(`📧 Attempting to send email to: ${email}`);
  
  const transport = getTransporter();
  
  const mailOptions = {
    from: `"AU Placements Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your Login Link - AU Placements Portal',
    html: buildEmailHtml(fullName, magicLink)
  };

  try {
    // Add timeout for production environments
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email send timeout')), 30000); // 30 second timeout
    });
    
    const sendPromise = transport.sendMail(mailOptions);
    const info = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log(`✅ Email sent successfully via Gmail:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Gmail send failed:`, error.message);
    
    // Provide more specific error messages
    if (error.message.includes('Invalid login')) {
      throw new Error('Gmail authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD. Make sure you\'re using an App Password, not your regular Gmail password.');
    } else if (error.message.includes('Less secure app access')) {
      throw new Error('Gmail security settings blocking access. Please enable "Less secure app access" or use an App Password.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Email service timeout. Please try again.');
    } else if (error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND')) {
      throw new Error('Network connection issue. Please check your internet connection and try again.');
    } else {
      throw new Error(`Gmail email failed: ${error.message}`);
    }
  }
}

async function verifyEmailConfig() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { ready: false, provider: null, message: 'Gmail not configured. Set EMAIL_USER and EMAIL_PASSWORD environment variables.' };
    }
    
    const transport = getTransporter();
    await transport.verify();
    return { ready: true, provider: 'gmail' };
  } catch (error) {
    console.error('Gmail config verification failed:', error.message);
    return { ready: false, provider: 'gmail', message: `Gmail verification failed: ${error.message}` };
  }
}

// Cleanup function for production
function closeTransporter() {
  if (transporter) {
    transporter.close();
    transporter = null;
  }
}

// Handle process termination
process.on('SIGINT', closeTransporter);
process.on('SIGTERM', closeTransporter);

module.exports = {
  sendMagicLinkEmail,
  verifyEmailConfig,
  closeTransporter
};
