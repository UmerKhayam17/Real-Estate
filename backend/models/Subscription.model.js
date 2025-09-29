// models/Subscription.model.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  startAt: { type: Date, default: Date.now },
  endAt: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
