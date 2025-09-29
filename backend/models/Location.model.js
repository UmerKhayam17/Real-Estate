// models/Location.model.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  slug: String,
  center: { type: [Number], default: [0, 0] } // [lng, lat]
});

module.exports = mongoose.model('Location', locationSchema);
