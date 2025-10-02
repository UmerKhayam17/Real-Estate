const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'PKR' },
  type: { type: String, default: 'residential' },
  saleOrRent: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  status: { type: String, enum: ['available', 'sold', 'rented', 'pending'], default: 'available' },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    isMain: { type: Boolean, default: false },
    caption: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  features: { type: [String], default: [] },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

propertySchema.pre('save', function(next) {
  const mainMedia = this.media.filter(m => m.isMain);
  if (mainMedia.length > 1) {
    return next(new Error('Only one media can be set as main'));
  }
  next();
});

propertySchema.index({ title: 'text', description: 'text', 'address.city': 'text' });
propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);