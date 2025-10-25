// models/User.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String },
    role: { type: String, enum: ["super_admin", "company_admin", "dealer", "user"], default: 'user' },
    profileImage: { type: String, default: '' },
    verified: { type: Boolean, default: false },

    // OTP fields
    otp: { type: String },
    otpExpires: { type: Date },

    // Track if dealer has completed profile
    dealerProfileCompleted: { type: Boolean, default: false },
    // Company reference (for company_admin and dealers belonging to company)
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },

    createdAt: { type: Date, default: Date.now }
});

// Virtual for dealer profile
userSchema.virtual('dealerProfile', {
    ref: 'Dealer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});

// Virtual for company details
userSchema.virtual('company', {
    ref: 'Company',
    localField: 'companyId',
    foreignField: '_id',
    justOne: true
});

// Enable virtuals in JSON response
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);