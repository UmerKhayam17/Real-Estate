const nodemailer = require("nodemailer");

// Debug environment variables
// console.log('🔍 Email config check:', {
//   user: process.env.MAIL_USER ? '✓ Set' : '✗ Missing',
//   pass: process.env.MAIL_PASS ? '✓ Set' : '✗ Missing',
//   from: process.env.MAIL_FROM ? '✓ Set' : '✗ Missing'
// });

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
    // console.log('✅ Email transporter is ready to send messages');
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
  }),

  // services/email.service.js - Add new templates
  companyRegistrationOtp: (ownerName, otp, companyName, planName, planPrice) => ({
    subject: `Verify Your Company Registration - ${companyName}`,
    text: `Hello ${ownerName}, Your OTP code is ${otp}. Company: ${companyName}, Plan: ${planName} (${planPrice === 0 ? 'Free' : '$' + planPrice}).`,
    html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
       <h2 style="color: #333;">Welcome to Our Platform!</h2>
       <p>Hello ${ownerName},</p>
       <p>Your company <strong>${companyName}</strong> has been registered successfully.</p>
       <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
         <h3 style="margin: 0 0 10px 0;">Plan Details:</h3>
         <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
         <p style="margin: 5px 0;"><strong>Price:</strong> ${planPrice === 0 ? 'Free' : '$' + planPrice}</p>
         <p style="margin: 5px 0;"><strong>Status:</strong> ${planPrice === 0 ? 'Active' : 'Pending Payment'}</p>
       </div>
       <p>Your OTP code is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
       <p>This code will expire in <strong>10 minutes</strong>.</p>
       ${planPrice > 0 ? '<p>After verification, you will be redirected to complete the payment process.</p>' : ''}
       <hr style="border: none; border-top: 1px solid #eee;">
       <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
     </div>
   `,
  }),

  newCompanyRegistrationNotification: (adminName, ownerName, companyName, planName, planPrice, companyId) => ({
    subject: "🏢 New Company Registration - Plan Selected",
    text: `Hello ${adminName}, a new company ${companyName} has been registered by ${ownerName} with plan: ${planName} (${planPrice}).`,
    html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
       <h2 style="color: #333;">New Company Registration</h2>
       <p>Hello ${adminName},</p>
       <p>A new company <strong>${companyName}</strong> has been registered by <strong>${ownerName}</strong>.</p>
       <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
         <h3 style="margin: 0 0 10px 0;">Selected Plan:</h3>
         <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
         <p style="margin: 5px 0;"><strong>Price:</strong> $${planPrice}</p>
         <p style="margin: 5px 0;"><strong>Status:</strong> ${planPrice === 0 ? 'Active' : 'Pending Payment'}</p>
       </div>
       <p><strong>Company ID:</strong> ${companyId}</p>
       <p>Please review their application in the admin panel.</p>
       <hr style="border: none; border-top: 1px solid #eee;">
       <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
     </div>
   `,
  }),

  companyStatusUpdate: (ownerName, companyName, status, reason) => ({
    subject: `Company Status Update: ${companyName}`,
    text: `Hello ${ownerName}, your company ${companyName} status has been updated to ${status}. ${reason ? `Reason: ${reason}` : ''}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${ownerName},</h2>
      <p>Your company <strong>${companyName}</strong> status has been updated to <strong>${status}</strong>.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      ${status === 'approved' ?
        '<p>🎉 Congratulations! Your company has been approved. You can now login and start managing your dealers.</p>' :
        '<p>Please contact support if you have any questions.</p>'
      }
      <hr style="border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
    </div>
  `,
  }),

  // Add these to your emailTemplates object
  dealerJoinRequest: (adminName, dealerName, businessName, companyName, dealerId) => ({
    subject: `New Dealer Join Request - ${businessName}`,
    html: `
    <h2>New Dealer Join Request</h2>
    <p>Hello ${adminName},</p>
    <p>You have received a new join request from dealer <strong>${dealerName}</strong> (${businessName}) to join your company <strong>${companyName}</strong>.</p>
    <p><strong>Dealer Details:</strong></p>
    <ul>
      <li>Name: ${dealerName}</li>
      <li>Business: ${businessName}</li>
    </ul>
    <p>Please review this request in your company admin dashboard and approve or reject it.</p>
    <a href="${process.env.FRONTEND_URL}/company-admin/dealers/requests" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Request</a>
    <p>Best regards,<br>Your Platform Team</p>
  `
  }),
  // Add to your emailTemplates in email.service.js
  newDealerWithCompanyRequest: (adminName, dealerName, businessName, companyName, dealerId) => ({
    subject: `New Dealer Profile + Company Join Request`,
    html: `
    <h2>New Dealer with Company Join Request</h2>
    <p>Hello ${adminName},</p>
    <p>A new dealer <strong>${dealerName}</strong> (${businessName}) has completed their profile and requested to join your company <strong>${companyName}</strong>.</p>
    <p><strong>Action Required:</strong></p>
    <p>Please review both their dealer profile approval and company join request.</p>
    <a href="${process.env.FRONTEND_URL}/company-admin/dealers/pending" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Requests</a>
    <p>Best regards,<br>Your Platform Team</p>
  `
  }),

  companyJoinRequestApproved: (dealerName, companyName, reason) => ({
    subject: `Welcome to ${companyName}!`,
    html: `
    <h2>Company Join Request Approved</h2>
    <p>Hello ${dealerName},</p>
    <p>Great news! Your request to join <strong>${companyName}</strong> has been approved.</p>
    ${reason ? `<p><strong>Message:</strong> ${reason}</p>` : ''}
    <p>You are now officially part of ${companyName} and can start collaborating with the team.</p>
    <a href="${process.env.FRONTEND_URL}/dealer/dashboard" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
    <p>Best regards,<br>Your Platform Team</p>
  `
  }),

  companyJoinRequestRejected: (dealerName, companyName, reason) => ({
    subject: `Update on Your Company Join Request`,
    html: `
    <h2>Company Join Request Update</h2>
    <p>Hello ${dealerName},</p>
    <p>Your request to join <strong>${companyName}</strong> has been reviewed.</p>
    <p><strong>Status:</strong> Not Approved</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>You can continue as an independent dealer and apply to other companies later.</p>
    <a href="${process.env.FRONTEND_URL}/dealer/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
    <p>Best regards,<br>Your Platform Team</p>
  `
  })
};
