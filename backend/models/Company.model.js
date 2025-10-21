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

   adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: null
   },

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

   subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'expired'],
      default: 'inactive'
   },

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

   status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
   },

   documents: [{ type: String }],

   // Track pending join requests for quick access
   pendingJoinRequests: [{
      dealerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Dealer',
         required: true
      },
      dealerName: String,
      businessName: String,
      requestedAt: Date
   }],

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

// Method to add pending join request
companySchema.methods.addPendingRequest = function (dealerId, dealerName, businessName) {
   this.pendingJoinRequests.push({
      dealerId,
      dealerName,
      businessName,
      requestedAt: new Date()
   });
};

// Method to remove pending request
companySchema.methods.removePendingRequest = function (dealerId) {
   this.pendingJoinRequests = this.pendingJoinRequests.filter(
      req => !req.dealerId.equals(dealerId)
   );
};

// Update timestamp before save
companySchema.pre('save', function (next) {
   this.updatedAt = Date.now();
   next();
});

module.exports = mongoose.model('Company', companySchema);