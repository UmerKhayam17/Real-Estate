// utils/validators/property.validator.js
const Joi = require('joi');

exports.createPropertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().required(),
  currency: Joi.string().optional(),
  type: Joi.string().optional(),
  saleOrRent: Joi.string().valid('sale','rent').optional(),
  bedrooms: Joi.number().optional(),
  bathrooms: Joi.number().optional(),
  area: Joi.number().optional(),
  location: Joi.string().optional() // "lng,lat"
});
