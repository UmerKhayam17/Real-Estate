const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Dealer, Company } = require('../models');
const { jwtSign } = require('../services/auth.service');
const { generateUserId } = require("../services/auth.service");
const { sendMail, emailTemplates } = require('../services/email.service');
const { SALT_ROUNDS = 10 } = process.env;


exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = "user", companyId = null } = req.body;

    // Validate company assignment
    if (companyId && role !== 'dealer') {
      return res.status(400).json({ message: "Only dealers can be assigned to companies" });
    }

    // Check if user already exists and verified
    let existing = await User.findOne({ email });
    if (existing && existing.verified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const passwordHash = await bcrypt.hash(password, salt);

    let user;
    if (!existing) {
      // Create new user (unverified)
      user = await User.create({
        userId: generateUserId(email || phone),
        name,
        email,
        phone,
        passwordHash,
        role,
        companyId,
        otp,
        otpExpires: Date.now() + 3 * 60 * 1000,
        verified: false,
        dealerProfileCompleted: false
      });
    } else {
      // Update existing unverified user
      existing.passwordHash = passwordHash;
      existing.companyId = companyId;
      existing.role = role;
      existing.otp = otp;
      existing.otpExpires = Date.now() + 3 * 60 * 1000;
      user = await existing.save();
    }

    // Debug OTP in dev
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔑 OTP for ${email}: ${otp}`);
    }

    await sendMail({
      to: email,
      ...emailTemplates.otp(name, otp),
    });

    res.status(200).json({
      message: "OTP sent to email. Please verify to activate account.",
      role: role
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // OTP invalid or expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({ message: "Invalid or expired OTP. Please register again." });
    }

    // Mark verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwtSign({ id: user._id, role: user.role });

    const response = {
      message: user.role === "dealer"
        ? "Account verified successfully. Please complete your dealer profile to get started."
        : "Account verified successfully",
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      token,
    };

    // Add dealer status if user is dealer
    if (user.role === "dealer") {
      response.dealerStatus = "profile_incomplete";
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.completeDealerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dealerData = req.body;
    console.log("the user is ", userId)
    // Check if user is actually a dealer
    const user = await User.findById(userId);
    if (!user || user.role !== "dealer") {
      return res.status(400).json({ message: "User is not registered as dealer" });
    }

    // Check if dealer profile already exists
    let dealerProfile = await Dealer.findOne({ userId });

    // Set approval status based on company
    const approvalStatus = 'pending'; // All new profiles start as pending

    if (dealerProfile) {
      // Update existing profile
      dealerProfile = await Dealer.findOneAndUpdate(
        { userId },
        {
          ...dealerData,
          approvalStatus: 'pending',
          approvedBy: null,
          approvedAt: null,
          rejectionReason: ''
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new dealer profile
      dealerProfile = await Dealer.create({
        userId,
        companyId:user.companyId,
        ...dealerData,
        approvalStatus,
      });

      // Mark dealer profile as completed in user record
      user.dealerProfileCompleted = true;
      await user.save();
    }

    // Notify admin about profile creation/update
    await this.notifyAdminNewDealer(user, dealerProfile);

    res.status(200).json({
      message: "Dealer profile submitted successfully. Waiting for admin approval.",
      dealerProfile,
      status: "pending_approval"
    });
  } catch (err) {
    next(err);
  }
};

exports.checkDealerStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "dealer") {
      return res.status(400).json({ message: "User is not a dealer" });
    }

    const dealerProfile = await Dealer.findOne({ userId })
      .populate('userId', 'name email phone')
      .populate('companyId', 'name status')
      .populate('approvedBy', 'name email');

    if (!dealerProfile) {
      return res.status(200).json({
        message: "Dealer profile not completed",
        hasDealerProfile: false,
        status: "profile_incomplete"
      });
    }

    res.status(200).json({
      hasDealerProfile: true,
      dealerProfile,
      approvalStatus: dealerProfile.approvalStatus,
      status: dealerProfile.approvalStatus
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.verified) {
      return res.status(400).json({ message: 'Please complete registration first' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    // Get dealer status if user is dealer
    let dealerStatus = null;
    if (user.role === "dealer") {
      const dealerProfile = await Dealer.findOne({ userId: user._id });
      if (!dealerProfile) {
        dealerStatus = {
          hasProfile: false,
          status: "profile_incomplete",
          message: "Please complete your dealer profile"
        };
      } else {
        dealerStatus = {
          hasProfile: true,
          approvalStatus: dealerProfile.approvalStatus,
          businessName: dealerProfile.businessName,
          status: dealerProfile.approvalStatus
        };
      }
    }

    const token = jwtSign({ id: user._id, role: user.role });

    const response = {
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      token
    };

    // Add dealer status if applicable
    if (user.role === "dealer") {
      response.dealerStatus = dealerStatus;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

exports.getPendingDealers = async (req, res, next) => {
  try {
    const { role, companyId } = req.user;

    let filter = { approvalStatus: 'pending' };

    // Company admin can only see dealers from their company
    if (role === 'company_admin') {
      if (!companyId) {
        return res.status(403).json({ message: "Company admin must be assigned to a company" });
      }
      filter.companyId = companyId;
    }
    // Super admin can see all pending dealers
    else if (role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const pendingDealers = await Dealer.find(filter)
      .populate('userId', 'name email phone createdAt')
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ pendingDealers });
  } catch (err) {
    next(err);
  }
};

exports.approveDealer = async (req, res, next) => {
  try {
    const { role, companyId, id: approverId } = req.user;
    const { dealerId } = req.params;
    const { action, reason } = req.body;

    const dealerProfile = await Dealer.findById(dealerId)
      .populate('userId')
      .populate('companyId');

    if (!dealerProfile) {
      return res.status(404).json({ message: "Dealer profile not found" });
    }

    // Authorization check
    if (dealerProfile.companyId) {
      // Company dealer - only company admin can approve
      if (role !== 'company_admin' || String(dealerProfile.companyId._id) !== String(companyId)) {
        return res.status(403).json({ message: "Only company admin can approve company dealers" });
      }
    } else {
      // Independent dealer - only super admin can approve
      if (role !== 'super_admin') {
        return res.status(403).json({ message: "Only super admin can approve independent dealers" });
      }
    }

    if (action === 'approve') {
      dealerProfile.approvalStatus = 'approved';
      dealerProfile.approvedBy = approverId;
      dealerProfile.approvedAt = new Date();
      dealerProfile.rejectionReason = '';

      await dealerProfile.save();

      // Send approval email to dealer
      await sendMail({
        to: dealerProfile.userId.email,
        ...emailTemplates.dealerApproved(dealerProfile.userId.name, dealerProfile.businessName),
      });

      res.status(200).json({
        message: "Dealer approved successfully",
        dealerProfile
      });

    } else if (action === 'reject') {
      dealerProfile.approvalStatus = 'rejected';
      dealerProfile.approvedBy = approverId;
      dealerProfile.approvedAt = new Date();
      dealerProfile.rejectionReason = reason;

      await dealerProfile.save();

      // Send rejection email
      await sendMail({
        to: dealerProfile.userId.email,
        ...emailTemplates.dealerRejected(
          dealerProfile.userId.name,
          dealerProfile.businessName,
          reason
        ),
      });

      res.status(200).json({
        message: "Dealer rejected successfully",
        reason
      });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    next(err);
  }
};

exports.notifyAdminNewDealer = async (user, dealerProfile) => {
  try {
    let admins = [];

    if (dealerProfile.companyId) {
      // Notify company admin for company dealers
      admins = await User.find({
        role: 'company_admin',
        companyId: dealerProfile.companyId
      });
    } else {
      // Notify super admin for independent dealers
      admins = await User.find({ role: 'super_admin' });
    }

    for (const admin of admins) {
      await sendMail({
        to: admin.email,
        ...emailTemplates.newDealerNotification(
          admin.name,
          user.name,
          dealerProfile.businessName,
          dealerProfile._id
        ),
      });
    }
  } catch (error) {
    console.error("Error notifying admin:", error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .populate('companyId', 'name status');

    let dealerProfile = null;
    let dealerStatus = null;

    if (user.role === "dealer") {
      dealerProfile = await Dealer.findOne({ userId: user._id })
        .populate('companyId', 'name status')
        .populate('approvedBy', 'name email');

      dealerStatus = dealerProfile ? {
        ...dealerProfile.toObject(),
        approvalStatus: dealerProfile.approvalStatus,
        status: dealerProfile.approvalStatus
      } : {
        status: "profile_incomplete",
        message: "Please complete your dealer profile"
      };
    }

    res.json({
      user,
      dealerProfile: dealerStatus
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, companyId } = req.user;

    // Check if user has admin privileges
    if (!['super_admin', 'company_admin'].includes(role)) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Company admin can only see users from their company
    let filter = {};
    if (role === 'company_admin') {
      filter.companyId = companyId;
    }

    // Get all users with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build additional filters
    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.verified !== undefined) {
      filter.verified = req.query.verified === 'true';
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Get users with dealer profile populated
    const users = await User.find(filter)
      .select('-passwordHash -otp -otpExpires')
      .populate({
        path: 'dealerProfile',
        select: 'businessName approvalStatus officeAddress officeCity rating totalSales createdAt'
      })
      .populate('companyId', 'name status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format the response
    const formattedUsers = users.map(user => ({
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      verified: user.verified,
      dealerProfileCompleted: user.dealerProfileCompleted,
      company: user.companyId,
      createdAt: user.createdAt,

      // Dealer specific info
      dealerProfile: user.dealerProfile ? {
        businessName: user.dealerProfile.businessName,
        approvalStatus: user.dealerProfile.approvalStatus,
        officeAddress: user.dealerProfile.officeAddress,
        officeCity: user.dealerProfile.officeCity,
        rating: user.dealerProfile.rating,
        totalSales: user.dealerProfile.totalSales,
        status: user.dealerProfile.approvalStatus
      } : null
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};