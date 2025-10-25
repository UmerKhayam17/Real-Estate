const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true },
    licenseNumber: { type: String },
    officeAddress: { type: String, required: true },
    officeCity: { type: String, required: true },
    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },
    yearsOfExperience: { type: Number, default: 0 },
    specialization: [{ type: String }],
    description: { type: String, maxlength: 1000 },
    website: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },
    whatsappNumber: { type: String },
    cnic: { type: String, required: true },
    documents: [{ type: String }],

    // Company reference (if approved to join a company)
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },

    // Company join request during profile completion
    companyJoinRequest: {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'none'],
        default: 'none'
      },
      requestedAt: Date,
      respondedAt: Date,
      responseReason: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },

    // Approval system for dealer profile
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },

    // Stats
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRentals: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
dealerSchema.index({ companyId: 1, approvalStatus: 1 });
dealerSchema.index({ approvalStatus: 1 });
dealerSchema.index({ userId: 1 });

module.exports = mongoose.model('Dealer', dealerSchema);