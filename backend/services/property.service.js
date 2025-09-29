// services/property.service.js
const Property = require('../models/Property.model');

exports.findById = async (id) => {
  return Property.findById(id);
};
