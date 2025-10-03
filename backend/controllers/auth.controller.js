const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Dealer = require('../models/Dealer');
const { jwtSign } = require('../services/auth.service');
const { generateUserId } = require("../services/auth.service");
const { sendMail, emailTemplates } = require('../services/email.service');
const { SALT_ROUNDS = 10 } = process.env;

// ----------------- REGISTER (Step 1) -----------------
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = "user" } = req.body;

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
        otp,
        otpExpires: Date.now() + 1 * 60 * 1000,
        verified: false,
        dealerProfileCompleted: false
      });
    } else {
      // Update existing unverified user
      existing.passwordHash = passwordHash;
      existing.role = role;
      existing.otp = otp;
      existing.otpExpires = Date.now() + 1 * 60 * 1000;
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

// ----------------- VERIFY OTP (Step 2) -----------------
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
console.log("the re")
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

// ----------------- COMPLETE DEALER PROFILE (After registration) -----------------
exports.completeDealerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dealerData = req.body;
    console.log(dealerData);
    // Check if user is actually a dealer
    const user = await User.findById(userId);
    if (!user || user.role !== "dealer") {
      return res.status(400).json({ message: "User is not registered as dealer" });
    }

    // Check if dealer profile already exists
    let dealerProfile = await Dealer.findOne({ userId });

    if (dealerProfile) {
      // Update existing profile
      dealerProfile = await Dealer.findOneAndUpdate(
        { userId },
        { ...dealerData, isVerified: false },
        { new: true, runValidators: true }
      );
    } else {
      // Create new dealer profile
      dealerProfile = await Dealer.create({
        userId,
        ...dealerData,
        isVerified: false,
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

// ----------------- CHECK DEALER STATUS -----------------
exports.checkDealerStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "dealer") {
      return res.status(400).json({ message: "User is not a dealer" });
    }

    const dealerProfile = await Dealer.findOne({ userId })
      .populate('userId', 'name email phone');

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
      approvalStatus: dealerProfile.isVerified ? "approved" : "pending_approval",
      status: dealerProfile.isVerified ? "approved" : "pending_approval"
    });
  } catch (err) {
    next(err);
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res, next) => {
  try {
    console.log("here")
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
          isVerified: dealerProfile.isVerified,
          businessName: dealerProfile.businessName,
          status: dealerProfile.isVerified ? "approved" : "pending_approval"
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
        role: user.role
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

// ----------------- ADMIN: GET PENDING DEALERS -----------------
exports.getPendingDealers = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const pendingDealers = await Dealer.find({ isVerified: false })
      .populate('userId', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ pendingDealers });
  } catch (err) {
    next(err);
  }
};

// ----------------- ADMIN: APPROVE/REJECT DEALER -----------------
exports.approveDealer = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { dealerId } = req.params;
    const { action, reason } = req.body;

    const dealerProfile = await Dealer.findById(dealerId).populate('userId');
    if (!dealerProfile) {
      return res.status(404).json({ message: "Dealer profile not found" });
    }

    if (action === 'approve') {
      dealerProfile.isVerified = true;
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

// ----------------- NOTIFY ADMIN ABOUT NEW DEALER -----------------
exports.notifyAdminNewDealer = async (user, dealerProfile) => {
  try {
    // Find admin users
    const admins = await User.find({ role: "admin" });

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

// ----------------- ME -----------------
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    let dealerProfile = null;
    let dealerStatus = null;

    if (user.role === "dealer") {
      dealerProfile = await Dealer.findOne({ userId: user._id });
      dealerStatus = dealerProfile ? {
        ...dealerProfile.toObject(),
        approvalStatus: dealerProfile.isVerified ? "approved" : "pending_approval",
        status: dealerProfile.isVerified ? "approved" : "pending_approval"
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

    console.log("here")
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Get all users with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter based on query parameters
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role; // Filter by role: admin, dealer, user
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
      .select('-passwordHash -otp -otpExpires') // Exclude sensitive fields
      .populate({
        path: 'dealerProfile',
        select: 'businessName isVerified officeAddress officeCity rating totalSales createdAt'
      })
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
      createdAt: user.createdAt,

      // Dealer specific info (if user is dealer)
      dealerProfile: user.dealerProfile ? {
        businessName: user.dealerProfile.businessName,
        isVerified: user.dealerProfile.isVerified,
        officeAddress: user.dealerProfile.officeAddress,
        officeCity: user.dealerProfile.officeCity,
        rating: user.dealerProfile.rating,
        totalSales: user.dealerProfile.totalSales,
        status: user.dealerProfile.isVerified ? 'approved' : 'pending'
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