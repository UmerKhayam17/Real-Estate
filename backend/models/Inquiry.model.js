// models/Inquiry.model.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: String,
  email: String,
  phone: String,
  message: String,
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
