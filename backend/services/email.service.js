const nodemailer = require("nodemailer");

// Debug environment variables
console.log('🔍 Email config check:', {
  user: process.env.MAIL_USER ? '✓ Set' : '✗ Missing',
  pass: process.env.MAIL_PASS ? '✓ Set' : '✗ Missing',
  from: process.env.MAIL_FROM ? '✓ Set' : '✗ Missing'
});

// ✅ Configure transporter with explicit settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ✅ Verify transporter connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check if MAIL_USER and MAIL_PASS are set in .env');
    console.log('2. Ensure Gmail App Password has no spaces');
    console.log('3. Verify 2-factor authentication is enabled on Gmail');
    console.log('4. Check if "Less secure app access" is enabled (if available)');
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

// ✅ Reusable sendMail function
exports.sendMail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to ${options.to}`);

    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Email service failed. Please try again later.");
  }
};

// ✅ Email templates
exports.emailTemplates = {
  otp: (name, otp) => ({
    subject: "Your OTP Code",
    text: `Hello ${name || "User"}, Your OTP code is ${otp}. It will expire in 1 minute.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Service</h2>
        <p>Hello ${name || "User"},</p>
        <p>Your OTP code is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
        <p>This code will expire in <strong>1 minute</strong>.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),

  welcome: (name) => ({
    subject: "Welcome to Our Platform 🎉",
    text: `Welcome ${name || "User"}! Your account has been successfully created.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Platform!</h2>
        <p>Hello ${name || "User"},</p>
        <p>Your account has been successfully created and is ready to use.</p>
        <p>Thank you for joining us!</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),

  // ✅ ADD THESE MISSING TEMPLATES:
  dealerApproved: (name, businessName) => ({
    subject: "🎉 Your Dealer Account Has Been Approved!",
    text: `Congratulations ${name}! Your dealer account for ${businessName} has been approved. You can now start posting properties.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Congratulations ${name}!</h2>
        <p>Your dealer account for <strong>${businessName}</strong> has been approved by our admin team.</p>
        <p>You can now start posting properties and managing your listings.</p>
        <p>Login to your account to get started!</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),

  dealerRejected: (name, businessName, reason) => ({
    subject: "Update on Your Dealer Account Application",
    text: `Dear ${name}, your dealer account application for ${businessName} could not be approved. Reason: ${reason || 'Not specified'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Dear ${name},</h2>
        <p>We regret to inform you that your dealer account application for <strong>${businessName}</strong> could not be approved at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>You may contact support if you have any questions or wish to reapply with additional information.</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),

  newDealerNotification: (adminName, dealerName, businessName, dealerId) => ({
    subject: "📋 New Dealer Registration Requires Approval",
    text: `Hello ${adminName}, a new dealer ${dealerName} has registered with business name ${businessName}. Please review their application.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${adminName},</h2>
        <p>A new dealer <strong>${dealerName}</strong> has registered with business name <strong>${businessName}</strong>.</p>
        <p>Please review their application in the admin panel.</p>
        <p><strong>Dealer ID:</strong> ${dealerId}</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
      </div>
    `,
  })
};