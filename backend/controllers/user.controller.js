// controllers/user.controller.js
const User = require('../models/User.model');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').limit(500);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

