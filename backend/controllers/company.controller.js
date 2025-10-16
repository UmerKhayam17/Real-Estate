// controllers/company.controller.js
const { Company, User, Dealer } = require('../models');
const { generateUserId } = require('../services/auth.service');
const { sendMail, emailTemplates } = require('../services/email.service');
const bcrypt = require('bcryptjs');

// ----------------- REGISTER COMPANY (By dealer/owner) -----------------
exports.registerCompany = async (req, res, next) => {
   try {
      const {
         name, email, phone, address, city, licenseNumber, website,
         ownerName, ownerEmail, ownerPassword, ownerPhone
      } = req.body;

      // Check if company email already exists
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
         return res.status(400).json({ message: "Company email already registered" });
      }

      // Check if owner email already exists
      const existingOwner = await User.findOne({ email: ownerEmail });
      if (existingOwner) {
         return res.status(400).json({ message: "Owner email already registered" });
      }

      // Generate OTP for owner verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(ownerPassword, salt);

      // Create owner user (company_admin role)
      const owner = await User.create({
         userId: generateUserId(ownerEmail),
         name: ownerName,
         email: ownerEmail,
         phone: ownerPhone,
         passwordHash,
         role: 'company_admin',
         otp,
         otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
         verified: false
      });

      // Create company
      const company = await Company.create({
         companyId: generateUserId(email),
         name,
         email,
         phone,
         address,
         city,
         licenseNumber,
         website,
         adminId: owner._id, // Link to owner
         status: 'pending'
      });

      // Update owner with company reference
      owner.companyId = company._id;
      await owner.save();

      // Debug OTP in dev
      if (process.env.NODE_ENV !== "production") {
         console.log(`🔑 OTP for ${ownerEmail}: ${otp}`);
      }

      // Send OTP email to owner
      await sendMail({
         to: ownerEmail,
         ...emailTemplates.otp(ownerName, otp),
      });

      res.status(201).json({
         message: "Company registration submitted. Please verify owner email.",
         company: {
            id: company._id,
            name: company.name,
            email: company.email,
            status: company.status
         },
         owner: {
            id: owner._id,
            name: owner.name,
            email: owner.email
         }
      });
   } catch (err) {
      next(err);
   }
};

// ----------------- VERIFY COMPANY OWNER -----------------
exports.verifyCompanyOwner = async (req, res, next) => {
   try {
      const { email, otp } = req.body;

      const owner = await User.findOne({ email, role: 'company_admin' });
      if (!owner) {
         return res.status(400).json({ message: "Company owner not found" });
      }

      // OTP invalid or expired
      if (owner.otp !== otp || owner.otpExpires < Date.now()) {
         // Cleanup: delete both owner and company if OTP invalid
         await Company.deleteOne({ adminId: owner._id });
         await User.deleteOne({ _id: owner._id });
         return res.status(400).json({ message: "Invalid or expired OTP. Please register again." });
      }

      // Mark owner as verified
      owner.verified = true;
      owner.otp = undefined;
      owner.otpExpires = undefined;
      await owner.save();

      // Get company details
      const company = await Company.findOne({ adminId: owner._id });

      // Notify super admin about new company registration
      await this.notifySuperAdminNewCompany(company, owner);

      res.status(200).json({
         message: "Company owner verified successfully. Waiting for super admin approval.",
         company: {
            id: company._id,
            name: company.name,
            status: company.status
         },
         owner: {
            id: owner._id,
            name: owner.name,
            email: owner.email
         }
      });
   } catch (err) {
      next(err);
   }
};

// ----------------- GET PENDING COMPANIES (Super Admin Only) -----------------
exports.getPendingCompanies = async (req, res, next) => {
   try {
      const { role } = req.user;

      if (role !== 'super_admin') {
         return res.status(403).json({ message: "Access denied. Super admin only." });
      }

      const pendingCompanies = await Company.find({ status: 'pending' })
         .populate('adminId', 'name email phone verified')
         .sort({ createdAt: -1 });

      res.status(200).json({ pendingCompanies });
   } catch (err) {
      next(err);
   }
};

// ----------------- UPDATE COMPANY STATUS (Super Admin Only) -----------------
exports.updateCompanyStatus = async (req, res, next) => {
   try {
      const { companyId } = req.params;
      const { status, reason } = req.body;
      const { role } = req.user;

      if (role !== 'super_admin') {
         return res.status(403).json({ message: "Access denied. Super admin only." });
      }

      const company = await Company.findById(companyId).populate('adminId');
      if (!company) {
         return res.status(404).json({ message: "Company not found" });
      }

      company.status = status;
      await company.save();

      // Send notification to company owner
      await sendMail({
         to: company.adminId.email,
         ...emailTemplates.companyStatusUpdate(
            company.adminId.name,
            company.name,
            status,
            reason
         ),
      });

      res.status(200).json({
         message: `Company status updated to ${status}`,
         company
      });
   } catch (err) {
      next(err);
   }
};

// ----------------- NOTIFY SUPER ADMIN ABOUT NEW COMPANY -----------------
exports.notifySuperAdminNewCompany = async (company, owner) => {
   try {
      const superAdmins = await User.find({ role: 'super_admin' });

      for (const admin of superAdmins) {
         await sendMail({
            to: admin.email,
            ...emailTemplates.newCompanyNotification(
               admin.name,
               owner.name,
               company.name,
               company._id
            ),
         });
      }
   } catch (error) {
      console.error("Error notifying super admin:", error);
   }
};

// ----------------- GET ALL COMPANIES -----------------
exports.getCompanies = async (req, res, next) => {
   try {
      const { role, companyId } = req.user;

      let filter = {};

      // Company admin can only see their company
      if (role === 'company_admin') {
         filter._id = companyId;
      }
      // Super admin can see all companies
      else if (role !== 'super_admin') {
         return res.status(403).json({ message: "Access denied" });
      }

      const companies = await Company.find(filter)
         .populate('adminId', 'name email phone verified')
         .sort({ createdAt: -1 });

      res.status(200).json({ companies });
   } catch (err) {
      next(err);
   }
};

// ----------------- GET COMPANY DEALERS -----------------
exports.getCompanyDealers = async (req, res, next) => {
   try {
      const { companyId } = req.params;
      const { role, companyId: userCompanyId } = req.user;

      // Authorization check
      if (role === 'company_admin' && String(companyId) !== String(userCompanyId)) {
         return res.status(403).json({ message: "Access denied to this company" });
      }

      const dealers = await Dealer.find({ companyId })
         .populate('userId', 'name email phone')
         .populate('approvedBy', 'name email')
         .sort({ createdAt: -1 });

      res.status(200).json({ dealers });
   } catch (err) {
      next(err);
   }
};