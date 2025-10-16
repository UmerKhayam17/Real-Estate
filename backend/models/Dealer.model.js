const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 dealer profile per user
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
    specialization: [{ type: String }], // Residential, Commercial, Plots, etc.
    description: { type: String, maxlength: 1000 },
    website: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },
    whatsappNumber: { type: String },
    cnic: { type: String, required: true },
    documents: [{ type: String }], // CNIC, License, etc.

    // Company reference (optional - dealer may or may not belong to a company)
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },

    // Approval system
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // Who approved this dealer
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

// Index for better query performance
dealerSchema.index({ companyId: 1, approvalStatus: 1 });
dealerSchema.index({ approvalStatus: 1 }); 

module.exports = mongoose.model('Dealer', dealerSchema);
