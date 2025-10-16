const mongoose = require('mongoose');

const ALLOWED_FEATURES = [
  "analytics",
  "reports",
  "inventory_management",
  "vendor_management",
  "order_tracking",
  "support",
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
      match: [
        /^[a-zA-Z0-9\s-]+$/,
        "Plan name can only contain letters, numbers, spaces, and hyphens",
      ],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    validateDays: Number,
    limitations: {
      maxStaff: {
        type: Number,
        default: 10,
      },
      maxInventoryItems: {
        type: Number,
        default: 100,
      },
      maxVendors: {
        type: Number,
        default: 50,
      },
      features: [
      {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (value) => ALLOWED_FEATURES.includes(value),
          message: `Feature must be one of: ${ALLOWED_FEATURES.join(", ")}`,
        },
      },
    ],
    },
    history: [
      {
        action: String,
        performedBy: String, //userId
      createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    deleted: { type: Boolean, default: false },
    createdBy: {
      type: String,
      required: [true, "Creator is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// PlanSchema.index({ name: 1 });
// PlanSchema.index({ createdBy: 1, isActive: 1 });

module.exports= mongoose.model("Plan", PlanSchema);
