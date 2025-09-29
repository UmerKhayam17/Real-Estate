// controllers/subscription.controller.js
const Subscription = require('../models/Subscription.model');

exports.listSubscriptions = async (req, res, next) => {
  const subs = await Subscription.find().populate('user', 'name email');
  res.json(subs);
};

// other endpoints (subscribe / cancel) left as future work
