// models/Company.model.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
   companyId: { type: String, unique: true, required: true },
   name: { type: String, required: true, trim: true },
   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
   phone: { type: String, required: true },
   address: { type: String, required: true },
   city: { type: String, required: true },
   licenseNumber: { type: String, required: true },
   website: { type: String, default: '' },

   // Admin who registered the company
   adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   // Current active plan
   currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: null
   },

   // Plan history
   planHistory: [{
      planId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Plan',
         required: true
      },
      planName: String,
      price: Number,
      startDate: Date,
      endDate: Date,
      status: {
         type: String,
         enum: ['active', 'expired', 'cancelled'],
         default: 'active'
      },
      purchasedAt: {
         type: Date,
         default: Date.now
      }
   }],

   // Subscription status
   subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'expired'],
      default: 'inactive'
   },

   // Plan limitations (cached from current plan)
   planLimitations: {
      maxDealers: {
         type: Number,
         default: 5
      },
      maxProperties: {
         type: Number,
         default: 50
      },
      features: [{
         type: String,
         default: []
      }]
   },

   // Company status
   status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
   },

   // Documents
   documents: [{ type: String }], // Company registration, license, etc.

   // Stats
   totalDealers: { type: Number, default: 0 },
   totalProperties: { type: Number, default: 0 },
   isActive: { type: Boolean, default: true },

   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now }
});

// Virtual to check if company can add more dealers
companySchema.virtual('canAddDealer').get(function () {
   return this.totalDealers < this.planLimitations.maxDealers;
});

// Virtual to check if company can add more properties
companySchema.virtual('canAddProperty').get(function () {
   return this.totalProperties < this.planLimitations.maxProperties;
});

// Method to check if company has specific feature
companySchema.methods.hasFeature = function (feature) {
   return this.planLimitations.features.includes(feature);
};

// Update timestamp before save
companySchema.pre('save', function (next) {
   this.updatedAt = Date.now();
   next();
});

module.exports = mongoose.model('Company', companySchema);