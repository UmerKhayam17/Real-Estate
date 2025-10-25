// models/Plan.model.js
const mongoose = require('mongoose');

const ALLOWED_FEATURES = [
  "analytics",
  "reports",
  "inventory_management",
  "vendor_management",
  "order_tracking",
  "support",
  "basic_listings",
  "premium_listings",
  "dealer_management",
  "custom_branding",
  "multiple_locations",
  "advanced_analytics"
];

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Plan name cannot exceed 50 characters"],
      minlength: [3, "Plan name must be at least 3 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    currency: {
      type: String,
      default: 'USD'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      default: 'monthly'
    },
    validateDays: {
      type: Number,
      default: 30
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    limitations: {
      maxDealers: {
        type: Number,
        default: 5,
        min: 1
      },
      maxProperties: {
        type: Number,
        default: 50,
        min: 0
      },
      maxStaff: {
        type: Number,
        default: 10,
        min: 1
      },
      features: [{
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (value) => ALLOWED_FEATURES.includes(value),
          message: `Feature must be one of: ${ALLOWED_FEATURES.join(", ")}`,
        },
      }],
    },
    history: [{
      action: String,
      performedBy: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PlanSchema.index({ name: 1 });
PlanSchema.index({ isActive: 1, deleted: 1 });
PlanSchema.index({ price: 1 });
PlanSchema.index({ isDefault: 1 });

module.exports = mongoose.model("Plan", PlanSchema);