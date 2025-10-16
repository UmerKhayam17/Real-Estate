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
   isActive: { type: Boolean, default: true },

   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);